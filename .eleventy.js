const { format, formatISO, getYear } = require("date-fns");
const makeSlug = require(`./utils/make-slug`)
const { camelCase, startCase } = require('lodash')

module.exports = function(eleventyConfig) {
	
	const markdownIt = require('markdown-it');
	const markdownItOptions = {
		html: true,
		linkify: true
	};
	
	const md = markdownIt(markdownItOptions)
		.use(function(md) {
			// Recognize Mediawiki links ([[text]])
			md.linkify.add("[[", {
				validate: /^\s?([^\[\]\|\n\r]+)(\|[^\[\]\|\n\r]+)?\s?\]\]/,
				normalize: match => {
					const parts = match.raw.slice(2,-2).split("|");
					parts[0] = parts[0].replace(/.(md|markdown)\s?$/i, "");
					match.text = (parts[1] || parts[0]).trim();
					match.url = `/${makeSlug(parts[0].trim())}/`;
				}
			})
		})

	const image_folder = 'images';

	// All images in the `_notes` folder will be copied to the `images` folder. So update the `src`.
	md.renderer.rules.image = function (tokens, idx, options, env, self) {
	  const token = tokens[idx]
	  let imgSrc = token.attrGet('src')
	  const imgAlt = token.content
	  const imgTitle = token.attrGet('title')

	  if(!imgSrc.match(/^https?\:/)) {
	  	const filename = imgSrc.replace(/^.*[\\\/]/, '')
	  	imgSrc = '/' + image_folder + '/' + filename;
	  }

	  let html = `<img src="${imgSrc}" alt="${imgAlt}" />`; 
	  
	  return html
	}

	eleventyConfig.setLibrary('md', md);
	eleventyConfig.addPassthroughCopy('assets');
	eleventyConfig.addPassthroughCopy({
		"_notes/**/*.jpg": image_folder,
		"_notes/**/*.jpeg":image_folder,
		"_notes/**/*.png": image_folder,
		"_notes/**/*.svg": image_folder
	});
	eleventyConfig.setUseGitIgnore(false);

	// eleventyConfig.setPathPrefix(pathPrefix);
  // eleventyConfig.setTemplateFormats([
  //     "njk",
  //     "md",
  //     "svg",
  //     "jpg",
  //     "css",
  //     "png"
  // ]);

	eleventyConfig.addFilter("extractExcerpt", article => {
		return extractExcerpt(article);
	});

	eleventyConfig.addFilter("markdownify", string => {
		return ""; //md.render(string)
	})

	eleventyConfig.addFilter("stripHtml", string => {
		return string.replace(/<[^>]*>?/gm, '');
	})

	eleventyConfig.addFilter("makeSlug", string => {
		return makeSlug(string);
	})

	eleventyConfig.addFilter("parseSource", src => {
		return parseSource(src)
	})

	eleventyConfig.addFilter("readableDate", date => {
		return date ? format(date, "MMM dd, yyyy") : "";
	});

	eleventyConfig.addFilter("titleCase", str => {
		return startCase(camelCase(str))
	});

	eleventyConfig.addFilter("menu", menuItem => {
		let title = startCase(camelCase(menuItem.item))

		if(menuItem.title) title = menuItem.title

		if (menuItem.type == 'tag') {
      return `<a class="navbar-item" href="/tags/${menuItem.item}">${title}</a>`
    } else if (menuItem.type == 'page') {
    	return `<a class="navbar-item" href="/${menuItem.item}">${title}</a>`
    }
	})

	eleventyConfig.addFilter("keys", obj => Object.keys(obj)); // For debug

	eleventyConfig.addCollection("allNotes", function (collection) {
		return collection.getFilteredByGlob(["_notes/**/*.md", "index.md"]);
	});

	// Array of all tags with the number of notes tagged with it. {'tag-name': 3, 'another': 6 ...}
  eleventyConfig.addCollection("tagList", function(collection) {
    return makeTagList(collection);
  });

  // List of top 20 tags.
  eleventyConfig.addCollection("topTags", function(collection) {
    const tagList = makeTagList(collection);
		
		let sortable = [];
		for (var tag in tagList) {
		  sortable.push([tag, tagList[tag]]);
		}

		sortable.sort(function(a, b) { // Sort by frequency
		  return b[1] - a[1];
		});

		let topTags = sortable.slice(0, 20); // Get the top 20 items only.
		let topTagsNames = topTags.map(item => item[0] )

    return topTagsNames;
  });


	return {
		dir: {
			input: "./",
			output: "_site",
			layouts: "layouts",
			includes: "includes",
			data: "_data"
		},
		// passthroughFileCopy: true
	}
}

function extractExcerpt(article) {
	let content;
	if(typeof article === 'string') {
		content = article;
	} else if (!article.hasOwnProperty('templateContent')) {
    console.warn('Failed to extract excerpt: Document has no property "templateContent".');
    return null;
  } else {
  	content = article.templateContent;
  }
 
  let excerpt = null;
  
  // The start and end separators to try and match to extract the excerpt
  const separatorsList = [
    { start: '<!-- Excerpt Start -->', end: '<!-- Excerpt End -->' },
    { start: '<p>', end: '</p>' }
  ];
 
  separatorsList.some(separators => {
    const startPosition = content.indexOf(separators.start);
    const endPosition = content.indexOf(separators.end);
 
    if (startPosition !== -1 && endPosition !== -1) {
      excerpt = content.substring(startPosition + separators.start.length, endPosition).trim();
      return true; // Exit out of array loop on first match
    }
  });
 
  return excerpt;
}

function makeTagList(collection) {
	const tagList = {};
  collection.getAll().map( item => {
    if (item.data.tags) { // handle pages that don't have tags
      for(let index in item.data.tags) {
      	let tag = item.data.tags[index];
      	if(tagList[tag] === undefined) tagList[tag] = 1;
      	else tagList[tag]++;
      }
    }
  });
  return tagList;
}

function parseSource(src) {
	if (!src) return null
  // :TODO: Handle a list of sources and not just a single source

  let link = ''
  if (src.includes('<a ')) {
  	link = src

  } else if (src.includes('](')) {
  	link = ""; //md.renderInline(src)

  } else if (src.includes('[[')) {
    // Source given as Wiki Link - internal link - [[Text]]
    const titleParts = src.match(/(.+)\|(.+)/) // [[Note Name|Link Text]] format.
    if (titleParts) {
      link = `<a href="/${makeSlug(titleParts[2])}/">${titleParts[1]}</a>`
    } else {
      const title = src.replace(new RegExp(/[\[\]]/, 'g'), '') // eslint-disable-line
      link = `<a href="/${makeSlug(title)}">${title}</a>`
    }

  } else {
  	link = `<a href="${src}">Link to Source</a>`;
  }

  return link
}
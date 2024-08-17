const { format } = require("date-fns");
const makeSlug = require(`./utils/make-slug`)
const { camelCase, startCase } = require('lodash')
const siteConfig = require("./_data/siteConfig.js");
const Plugin = require('markdown-it-regexp')
const fs = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {
  const imageFolder = 'images';
  if(!siteConfig.pathPrefix) siteConfig.pathPrefix = '/';
  
  const markdownIt = require('markdown-it');
  const markdownItOptions = {
    html: true,
    linkify: true
  };

  const fileNameList = fs.readdirSync('_notes/'); // Ideally, we should get this from collections, but I'm not sure how to do that
  
  const md = markdownIt(markdownItOptions)
    // Very simplified version of https://github.com/alexjv89/markdown-it-obsidian
    // Supports both [[WikiLinks]], and ![[ObsidianImageFormat.png]]
    .use(new Plugin(/!?\[\[(([^\]#\|]*)(\|[^\]]*)*(#[^\|\]]+)*)\]\]/,
      (match, utils) => {
        let label = ''
        let pageName = ''
        let noteName = ''
        const isSplit = !!match[3]
        if (isSplit) {
          label = match[3].slice(1) // Remove the | or the #
          pageName = makeSlug(match[2])
          noteName = match[2]
        } else {
          label = match[1] // ideally format(match[1])
          pageName = makeSlug(label)
          noteName = label
        }

        // make sure none of the values are empty
        if (!label || !pageName) {
          return match.input
        }

        // Make sure the linked note exists. We don't want 404 links
        if(fileNameList.find(ele => 
          (ele.toLowerCase() === noteName.toLowerCase()) || (path.parse(ele).name.toLowerCase() === path.parse(noteName).name.toLowerCase()) 
        ) === undefined) {
        return label
      }

        if(match[0].startsWith('!')) {
          return `<img src="${ absoluteUrl(`images/${match[1]}`) }" alt="${label}" />`
        } else {
          return `<a href="${ absoluteUrl(pageName) }/">${label}</a>`
        }
      }))

  // All images in the `_notes` folder will be copied to the `images` folder. So update the `src`.
  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx]
    let imgSrc = token.attrGet('src')
    const imgAlt = token.content

    if(!imgSrc.match(/^https?\:/)) {
      const filename = imgSrc.replace(/^.*[\\\/]/, '')
      imgSrc = siteConfig.pathPrefix + imageFolder + '/' + filename;
    }

    let html = `<img src="${imgSrc}" alt="${imgAlt}" />`; 
    
    return html
  }

  eleventyConfig.setLibrary('md', md);
  eleventyConfig.addPassthroughCopy('assets');
  eleventyConfig.addPassthroughCopy({
    "_notes/**/*.jpg": imageFolder,
    "_notes/**/*.jpeg":imageFolder,
    "_notes/**/*.png": imageFolder,
    "_notes/**/*.svg": imageFolder,
    "_notes/**/*.webp": imageFolder
  });
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addFilter("extractExcerpt", article => {
    return extractExcerpt(article);
  });

  eleventyConfig.addFilter("markdownify", string => {
    return md.render(string)
  })

  eleventyConfig.addFilter("stripHtml", string => {
    return string.replace(/<[^>]*>?/gm, '');
  })

  eleventyConfig.addFilter("makeSlug", string => {
    return makeSlug(string);
  })

  eleventyConfig.addFilter("absoluteUrl", string => {
    return absoluteUrl(string);
  })

  eleventyConfig.addFilter("absoluteTagUrl", tag => {
    return absoluteUrl( "tags/" + makeSlug(tag) + "/" );
  })

  eleventyConfig.addFilter("parseSource", src => {
    return parseSource(src, md)
  })

  eleventyConfig.addFilter("readableDate", date => {
    return date ? 
      ( Date.parse(date) ? format(Date.parse(date), "MMM dd, yyyy") : date )
      : ""
  });

  eleventyConfig.addFilter("titleCase", str => {
    return startCase(camelCase(str))
  });

  eleventyConfig.addFilter("menu", menuItem => {
    let title = startCase(camelCase(menuItem.item))

    if(menuItem.title) title = menuItem.title

    if (menuItem.type == 'tag') {
      return `<a class="navbar-item" href="${ absoluteUrl('tags/' + menuItem.item ) }">${title}</a>`
    } else if (menuItem.type == 'page') {
      return `<a class="navbar-item" href="${ absoluteUrl(menuItem.item) }">${title}</a>`
    } else if (menuItem.type == 'link') {
      return `<a class="navbar-item" href="${menuItem.item}">${title}</a>`
    }
  })

  eleventyConfig.addFilter("keys", obj => Object.keys(obj)); // For debug
  eleventyConfig.addFilter("json", obj => JSON.stringify(obj)); // For debug

  eleventyConfig.addCollection("allNotes", function (collection) {
    return collection.getFilteredByGlob(["_notes/**/*.md", "index.md"]);
  });
  eleventyConfig.addCollection("latestFiveNotes", function (collection) {
    return collection.getFilteredByGlob(["_notes/**/*.md", "index.md"])
      .sort((a, b) => b.date - a.date) // sort by date - descending
      .slice(0, 5);
  });

  eleventyConfig.addCollection("homeNote", function (collection) {
    if(!siteConfig.homeNote) return [];
    const homeNoteSlug = siteConfig.homeNote.replace(/\.md$/, '')
    return collection.getAll().filter(note => note.data.page.fileSlug.toLowerCase() === homeNoteSlug.toLowerCase())
  })
  
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
    pathPrefix: siteConfig.pathPrefix,
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

function absoluteUrl(string) {
  // The URL() will return root url if the suburl starts with a '/' - so remove it if its present.
  if (string.length > 0 && string.charAt(0) === '/') { 
    string = string.substring(1);
  }
  
  return new URL(string, siteConfig.url).href
}

function parseSource(src, md) {
  if (!src) return null
  // :TODO: Handle a list of sources and not just a single source

  let link = ''
  if (src.includes('<a ')) {
    link = src

  } else if (src.includes('](')) {
    link = md.renderInline(src)

  } else if (src.includes('[[')) {
    // Source given as Wiki Link - internal link - [[Text]]
    const titleParts = src.match(/(.+)\|(.+)/) // [[Note Name|Link Text]] format.
    if (titleParts) {
      link = `<a href="${ absoluteUrl( makeSlug(titleParts[2]) ) }/">${titleParts[1]}</a>`
    } else {
      const title = src.replace(new RegExp(/[\[\]]/, 'g'), '') // eslint-disable-line
      link = `<a href="${ absoluteUrl( makeSlug(title) ) }">${title}</a>`
    }

  } else {
    if(src.match(/^http/)) {
      link = `<a href="${src}">Link to Source</a>`;

    } else {
      link = src; // NOT a link.
    }
  }

  return link
}

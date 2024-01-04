const makeSlug = require(`../utils/make-slug`)
const { camelCase, startCase } = require('lodash')

// This regex finds all wikilinks in a string
const wikilinkRegExp = /\[\[\s?([^\[\]\|\n\r]+)(\|[^\[\]\|\n\r]+)?\s?\]\]/g

const caselessCompare = (a, b) => (a.toLowerCase() === b.toLowerCase())

module.exports = {
	layout: "note.njk",
	type: "note",
	eleventyComputed: {
		title: data => data.title || startCase(camelCase(data.page.fileSlug)),
		permalink: data => (data.slug || makeSlug(data.title || data.page.fileSlug)) + '/',
		date: data => data.date || data.page.date,
		backlinks: (data) => {
			const notes = data.collections.allNotes;
			const currentFileSlug = data.page.filePathStem.replace('/_notes/', '');

			let backlinks = [];

			if(!notes.length) { // Initial pass thru, system don't have all the data needed
				return backlinks;
			}

			// Search the other notes for backlinks
			for(const otherNote of notes) {
				const noteContent = otherNote.template.frontMatter.content;
				if(data.page.filePathStem === otherNote.data.page.filePathStem) continue; // Same file

				// Get all links from otherNote
				const outboundLinks = ( noteContent.match(wikilinkRegExp) || [])
					.map(link => {
						// Extract link location
						return link.slice(2,-2)
							.split("|")[0]
							.replace(/.(md|markdown)\s?$/i, "")
							.trim()
				});
				
				// If the other note links here, return related info
				if(outboundLinks.some(link => caselessCompare(link, currentFileSlug))) {
					let preview = noteContent.slice(0, 240).trim();

					backlinks.push({
						url: otherNote.url,
						title: otherNote.data.title,
						preview
					})
				}
			}

			return backlinks;
		}
	}
}

# 11-Garden

11-Garden lets you **create a static HTML version of your markdown notes**. You can convert your Obsidian Zettelkasten Notes into a public Digital Garden.

To see an example site built using 11 Garden, visit my [Digital Garden](https://notes.binnyva.com/)

## Features

- Support for wiki links - \[\[Note Name\]\]
- Backlinks at the bottom of the note
- Tagging supported
- Sitemap, Home Page generated automatically

## Getting Started

### Prerequisites

To use this tool, you'll need [node](https://nodejs.org/en/download/), [npm](https://www.npmjs.com/get-npm) and [git](https://git-scm.com/downloads) installed on your system.

### Installation

Once you have installed the necessary tools, you can **create a new site using `11-garden` using this command**...

```
git clone https://github.com/binnyva/11-garden my-garden
```

In this example, `my-garden` is the name of your site. You can test it using this command...

```
cd my-garden
npm install
npm start
```

If everything went fine, you should see `11-garden` running in your browser at <http://localhost:8080/>.

### Configuration

Once 11-garden has been installed, **add your markdown notes to the `_notes` folder**. Make sure you delete all the sample notes there first. If you are using Obsidian to create notes, you can set the `_notes` folder to be a shortcut/link to the Obsidian vault. If you don't do that, you'll have to copy over all the notes from the vault to the `_notes` folder everytime you want to make a static build of your notes.

Edit `_data\siteConfig.js` file and add your site details there. Few supported values are...

```js
module.exports = {
    title: "PKM Book",
    url: "http://localhost:8080", // "https://mindos.in/pkm-book/"
    author: "Binny V A",
    description: "Book about Personal Knowledge Management, Zettelkasten, Tools and Processes.",

    // headerMenu: [
    //   {type: 'page', item: '', title: 'Home'},
    //   {type: 'page', item: 'sitemap', title: 'Sitemap'},
    //   {type: 'page', item: 'rss.xml', title: 'RSS'},
    //   {
    //     type: 'page', item: 'tags', title: 'Tags',
    //     menu: [
    //       {type: 'tag',item: 'zettelkasten'},
    //       {type: 'tag',item: 'philosophy'},
    //       {type: 'tag',item: 'psychology'},
    //       {type: 'tag',item: 'rationality'},
    //       {type: 'tag',item: 'productivity'},
    //     ]
    //   },
    // ],
};

```

### Building

Once you are done with the configuration, you can **generate the static version of your site**. Use this command to do it...

```
npm compile
```

### Modifying

If you want to change something, edit the code in the `src` folder. You'll need a bit of JavaScript knowledge to do this. To do this well, you'll need to know how [Eleventy works](https://11ty.dev/).

You can test your modifications using this command...

```
npm start
```

## The Notes

The notes in the `_notes` folder have to be in markdown format. Ideally, in this format...

```markdown
---
title: 'Zettelkasten'
tags: ['zettelkasten', 'pkm', 'notes', 'learning']
date: 2022-10-20 19:30:00
---

Zettelkasten is a note taking process and a [[knowledge management system]].
```

The top part(within the `---`) is called frontmatter. Its the metadata about the note. This should be in YAML format. The following properties are supported...

- **slug** : This will show up in the URL of the note
- **title** : Title of the note. If not provided, uses the file name of the note
- **date** : Date the note was published.
- **tags** : List of tags that this note is tagged with.

[Obsidian](https://obsidian.md/) will create notes in this format.

## Contributing

One of the reasons I built this tool is to learn 11ty. If you know what 11ty and want to help with this project, I'm more than excited to get some expert help :-D. If you are interested in helping out, go to the [Contributing page](https://github.com/binnyva/11-garden/blob/master/CONTRIBUTING.md).

## Thank you

- Heavily influenced by [Eleventy Garden](https://github.com/binyamin/eleventy-garden/).
- [11ty](https://11ty.dev/)
- Design from the [X-Garden](https://github.com/Jekyll-Garden) family.

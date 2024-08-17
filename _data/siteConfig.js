// require("dotenv").config();

module.exports = {
    title: `11 Garden`,
    description: `A Digital Garden tended by Eleventy`,
    url: "http://localhost:8080/", // "https://notes.binnyva.com/"
    author: "Binny V A",
    pathPrefix: "/", // If your Digital Garden is not published at the root of your website, use this. Requires a ending '/'
    // homeNote: '11 Garden', // If you want to set one note as the Home page, set the file name here

    headerMenu: [
      {type: 'page', item: '', title: 'Home'},
      {type: 'page', item: 'sitemap', title: 'Sitemap'},
      {type: 'link', item: 'https://github.com/binnyva/11-garden', title: '11 Garden'},
      {
        type: 'page', item: '', title: 'Tags',
        menu: [
          {type: 'tag',item: 'zettelkasten'},
          {type: 'tag',item: 'pkm'},
        ]
      },
    ],
};

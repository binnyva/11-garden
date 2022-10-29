// require("dotenv").config();

module.exports = {
    // Website title
    title: "PKM Book",
    // Site URL to generate absolute URLs. Used across the board.
    url: "http://localhost:8080", // "https://mindos.in/pkm-book/"
    // Author name, shown in left sidebar, and used in JSON-LD
    author: "Binny V A",
    // Site description, shown below site image (optional)
    description: "Book about Personal Knowledge Management, Zettelkasten, Tools and Processes.",

    
    headerMenu: [
      {type: 'page', item: '', title: 'Home'},
      {type: 'page', item: 'sitemap', title: 'Sitemap'},
      {type: 'page', item: 'rss.xml', title: 'RSS'},
      {
        type: 'page', item: 'tags', title: 'Tags',
        menu: [
          {type: 'tag',item: 'zettelkasten'},
          {type: 'tag',item: 'philosophy'},
          {type: 'tag',item: 'psychology'},
          {type: 'tag',item: 'rationality'},
          {type: 'tag',item: 'productivity'},
        ]
      },
    ],
};

module.exports = {
  pathPrefix: "/",
  siteMetadata: {
    title: "Jenusdy's Portfolio",
    description: "Jenusdy Gatsby Portfolio Site",
    author: "@Jenusdy",
  },
  plugins: [
    {
      resolve: "gatsby-theme-portfolio-minimal",
      options: {
        siteUrl: "https://jenusdy.github.io/", // Used for sitemap generation
        manifestSettings: {
          favicon: "./content/images/jenusdy.jpg", // Path is relative to the root
          siteName: "Jenusdy's Portfolio", // Used in manifest.json
          shortName: "Portfolio", // Used in manifest.json
          startUrl: "/", // Used in manifest.json
          backgroundColor: "#FFFFFF", // Used in manifest.json
          themeColor: "#000000", // Used in manifest.json
          display: "minimal-ui", // Used in manifest.json
        },
        contentDirectory: "./content",
        blogSettings: {
          path: "/blog", // Defines the slug for the blog listing page
          usePathPrefixForArticles: false, // Default true (i.e. path will be /blog/first-article)
        },
      }
    }
  ],
};

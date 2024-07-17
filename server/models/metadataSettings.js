process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();

const MetadataSettings = {
  metadata: async function () {
    const defaultContent =
      "AnythingLLM | Your personal LLM trained on anything";
    return {
      // --------------------------------------------------------
      // Metadata configs
      // --------------------------------------------------------
      title: process.env.TAB_TITLE || defaultContent,
      image: process.env.TAB_IMAGE || "/favicon.png",
      description: process.env.APP_DESCRIPTION || defaultContent,

      // Social media metadatas (cf index.html)
      // OpenGraph SEO
      ogType: process.env.OG_TYPE || "website",
      ogUrl: process.env.OG_URL || "https://useanything.com",
      ogTitle: process.env.OG_TITLE || defaultContent,
      ogDescription: process.env.OG_DESCRIPTION || defaultContent,
      ogImage:
        process.env.OG_IMAGE ||
        "https://raw.githubusercontent.com/Mintplex-Labs/anything-llm/master/images/promo.png",

      // Twitter
      twitterCard: process.env.TWITTER_CARD || "summary_large_image",
      twitterUrl: process.env.TWITTER_URL || "https://useanything.com",
      twitterTitle: process.env.TWITTER_TITLE || defaultContent,
      twitterDescription: process.env.TWITTER_DESCRIPTION || defaultContent,
      twitterImage:
        process.env.TWITTER_IMAGE ||
        "https://raw.githubusercontent.com/Mintplex-Labs/anything-llm/master/images/promo.png",
    };
  },
};

module.exports.MetadataSettings = MetadataSettings;

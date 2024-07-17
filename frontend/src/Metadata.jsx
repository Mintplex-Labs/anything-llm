import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import System from "./models/system";

export function Metadata() {
  const [metadata, setMetadata] = useState({});

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const metadatas = await System.fetchMetadata();
        setMetadata(metadatas);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMetadata();
  }, [metadata]);

  return (
    <Helmet>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" href={metadata.image} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{metadata.title}</title>
      {/* Metadata for SEO */}
      <meta name="description" content={metadata.description} />
      <meta property="og:type" content={metadata.ogType} />
      <meta property="og:url" content={metadata.ogUrl} />
      <meta property="og:title" content={metadata.ogTitle} />
      <meta property="og:description" content={metadata.ogDescription} />
      <meta property="og:image" content={metadata.ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content={metadata.twitterCard} />
      <meta property="twitter:url" content={metadata.twitterUrl} />
      <meta property="twitter:title" content={metadata.twitterTitle} />
      <meta
        property="twitter:description"
        content={metadata.twitterDescription}
      />
      <meta property="twitter:image" content={metadata.twitterImage} />
      <link rel="apple-touch-icon" href={metadata.image} />
    </Helmet>
  );
}

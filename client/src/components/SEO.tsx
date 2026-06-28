interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEO = ({ title, description, image, url }: SEOProps) => {
  const defaultTitle = 'Amazon Clone - E-commerce Portfolio Project';
  const defaultDescription = 'Full-stack e-commerce application built with React, Node.js, and PostgreSQL';

  const metaTitle = title ? `${title} | Amazon Clone` : defaultTitle;
  const metaDescription = description || defaultDescription;

  // Since we're using Vite, we'll use the document head directly
  document.title = metaTitle;

  // Update meta tags
  const metaTags = [
    { name: 'description', content: metaDescription },
    { property: 'og:title', content: metaTitle },
    { property: 'og:description', content: metaDescription },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ];

  if (image) {
    metaTags.push({ property: 'og:image', content: image });
    metaTags.push({ name: 'twitter:image', content: image });
  }

  if (url) {
    metaTags.push({ property: 'og:url', content: url });
  }

  return null; // This component doesn't render anything
};

export default SEO;

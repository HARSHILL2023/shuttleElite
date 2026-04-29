import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description = "ShuttleElite - Premium Corporate Mobility for the Elite. Secure, fast, and tactical ride-sharing.",
  type = "website",
  name = "ShuttleElite",
  schema
}) => {
  const fullTitle = `${title} | ShuttleElite Operations`;
  
  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={name} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={window.location.href} />

      {/* JSON-LD Structured Data (Schema.org) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
      
      {/* Advanced SEO directives */}
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};

export default SEO;

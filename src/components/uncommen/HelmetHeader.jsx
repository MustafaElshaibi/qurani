import { Helmet } from "react-helmet-async";
export default function SEO({ title, description, name, type, candonical, robots, url, img , keywords}) {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content={name} />
      <link rel="canonical" href={candonical} />
      <meta name="robots" content={robots} />
      {url && <link rel="url" href={url} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {/* End standard metadata tags */}
      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={candonical} />
      <meta property="og:site_name" content={name} />
      {img && <meta property="og:image" content={img} />}
      {/* End Facebook tags */}
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content={type} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:url" content={candonical} />
      <meta name="twitter:site" content={name} />
      {img && <meta name="twitter:image" content={img} />}
      {/* End Twitter tags */}
    </Helmet>
  );
}

import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';
import express from 'express';

const router = express.Router();

const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/services', changefreq: 'monthly', priority: 0.8 },
  { url: '/projects', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.7 },
  { url: '/gallery', changefreq: 'monthly', priority: 0.7 },
  { url: '/testimonials', changefreq: 'monthly', priority: 0.6 },
  { url: '/blog', changefreq: 'weekly', priority: 0.6 },
];

// URL of your logo image
const logoUrl = 'https://www.mancherialinteriors.com/assets/logo.png';

router.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');

  const smStream = new SitemapStream({ hostname: 'https://www.mancherialinteriors.com' });
  const pipeline = smStream.pipe(createGzip());

  // Loop through the links and add the logo image on the homepage (or anywhere you want)
  links.forEach(link => {
    smStream.write(link);

    // Add image to the homepage or any specific URL
    if (link.url === '/') {  // This is where you include the logo (for homepage in this case)
      smStream.write({
        url: link.url,
        changefreq: link.changefreq,
        priority: link.priority,
        'image:image': [
          {
            'image:loc': logoUrl,
            'image:caption': 'Mancherial Interiors Logo', // Add any caption or description
          }
        ]
      });
    }
  });

  smStream.end();

  streamToPromise(pipeline)
    .then(sm => res.send(sm))
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
});

export const sitemapRouter = router;

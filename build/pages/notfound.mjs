import { btn, btnRow, icons } from '../components.mjs';

const body = `
<section class="notfound">
  <div class="wrap">
    <p class="notfound__code">404</p>
    <h1 class="display t-3xl mt-4">This page is not on file.</h1>
    <p class="lead mt-4" style="margin-inline:auto">The address you followed does not match a page on this site. The links below cover everything Ionic publishes.</p>
    <div class="mt-7" style="display:flex;justify-content:center">
      ${btnRow(
        btn('/', 'Back to home', { variant: 'primary' }),
        btn('/capabilities/', 'Capabilities', { variant: 'secondary' }),
        btn('/contact/', 'Contact', { variant: 'secondary' })
      )}
    </div>
  </div>
</section>
`;

export default {
  url: '/404.html',
  title: 'Page not found',
  description: 'The page you requested could not be found on the Ionic Contractors LLC website.',
  noIndex: true,
  body,
};

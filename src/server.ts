import express from 'express';
import { join } from 'node:path';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

const IS_NETLIFY = typeof process.env['NETLIFY'] !== 'undefined';
const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.get(/.*/, (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next();
      }
    })
    .catch(next);
});

if (!IS_NETLIFY && (isMainModule(import.meta.url) || process.env['pm_id'])) {
  const port = process.env['PORT'] || 4200;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);

const path = require('path')
const fs = require('fs')

// export pages route to gatsby-koa.json
// to use with koa static file serving
exports.onPostBootstrap = ({ store }, pluginOptions) => {
  const { redirects, pages } = store.getState();

  const p = [];
  for (const page of pages.values()) {
    // console.log(page);
    p.push({
      path: page.path,
      matchPath: page.matchPath
    });
  }

  const data = {
    redirects,
    pages: p
  };

  const filename = path.resolve(pluginOptions.output || 'config/gatsby-koa.json');
  fs.mkdirSync(path.dirname(filename), {recursive: true});
  fs.writeFileSync(
    filename,
    JSON.stringify(data, null, 2)
  );
}

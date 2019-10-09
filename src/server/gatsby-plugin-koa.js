// https://github.com/Yangeok/gatsby-plugin-koa/blob/master/index.js

const fs = require('fs');
const path = require('path');

const send = require('koa-send');
const match = require('@reach/router/lib/utils').match;

module.exports = function redirect (data = 'gatsby-koa.json', options) {
  const publicDir = options.publicDir || path.resolve('public/')
  const template =
    options.template || path.resolve(publicDir || 'public/', '404/index.html')

  if (typeof data === 'string') {
    data = fs.readFileSync(data)
    data = JSON.parse(data)
  }

  const join = p => path.join(publicDir, p)

  return async (ctx, next) => {
    for (let r of data.redirects) {
      if (ctx.path === r.fromPath) {
        const code = r.isPermanent ? 301 : 302
        return ctx.redirect(code, r.toPath)
      }
    }

    for (let page of data.pages) {
      if (ctx.path === page.path) {
        // handle /without-trailing-slash to /without-trailing-slash/index.html
        const index = require.resolve('index.html', {
          paths: [join(page.path)]
        })

        if (index) {
          // remove trailing slashes in request
          if (options.redirectSlashes && ctx.path.endsWith('/')) {
            return ctx.redirect(ctx.path.substr(0, ctx.path.length - 1))
          }
          await send(ctx, index)
        }
        break
      }
    }

    for (const page of data.pages.filter(p => p.matchPath)) {
      const m = match(page.matchPath, ctx.path)

      if (m) {
        const index = require.resolve('index.html', {
          paths: [join(m.uri)]
        })

        if (index) {
          await send(ctx, index)
        }
        break
      }
    }

    if (template && ctx.accepts('html')) {
      ctx.status = 404
      await send(ctx, template)
    } else {
      next()
    }
  }
};


const http = require('http');

const Koa = require('koa');
const cors = require('@koa/cors');
const KoaEx = require('koa-exception');
const grant = require('grant-koa');
const isBot = require('koa-isbot');
const serve = require('koa-static');
const proxies = require('koa-proxies');
const logger = require('koa-logger');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');

const gatsbykoa = require('./gatsby-plugin-koa');
const drive = require('./routes/drive');
const oauth = require('./routes/oauth');

const {
  GRANT_CONFIG,
} = require('./../../config');

const app = new Koa();
app.keys = ['grant'];

app.use(KoaEx());
app.use(logger());
app.use(cors());
// app.use(isBot());
app.use(bodyParser());

app.use(session(app));
app.use(grant(GRANT_CONFIG));

app.use(async (ctx, next) => {
  // set ctx.google = google token
  const { google = {} } = ctx.cookies.get("koa:sess");
  console.log(ctx.cookies.get("koa:sess"));
  ctx.google = google;
  await next();
})

app.use(oauth.routes())
app.use(drive.routes())

if (process.env.NODE_ENV === "development") {
  console.log("Proxy request to localhost:8000");
  app.use(proxies('/', {
    target: 'http://localhost:8000',
    changeOrigin: true,
    // logs: true
  }))
}
else {
  console.log("serving static from public/");
  app.use(serve('public/'));
  app.use(
    gatsbykoa('config/gatsby-koa.json', {
      publicDir: 'public/',
      template: 'public/404/index.html',
      redirectSlashes: true
    })
  );
}

app.on('error', (err, ctx) => {
  ctx.body = {
    error: true,
    message: err.message
  }
});

module.exports = app;

http.createServer(app.callback())
    .listen(3000);

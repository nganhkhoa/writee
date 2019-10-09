const Router = require('koa-router');
const router = new Router({
  prefix: '/oauth'
});

router.all('/google', async (ctx, next) => {
  // move from grant to google key
  // TODO: I don't know how to use this session
  // so maybe we should create another key for cookie
  const google_token = ctx.session.grant.response;
  ctx.session.google = google_token;
  ctx.body = {
    google_token
  }
});

module.exports = router;

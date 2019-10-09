const Router = require('koa-router');
const metadataParser = require('markdown-yaml-metadata-parser');

const {
  DEFAULT_DRIVE_FOLDER_NAME,
  MIMETYPES
} = require('../../../config');
const callGoogleAPI = require('../utils/google');

const router = new Router({
  prefix: '/drive'
});

/**
 * declare routing endpoint
 */
router.get('/', async (ctx, next) => {
  ctx.body = 'WRITEE/DRIVE API ENDPOINT';
});

/**
 * Get the default folder or create if not found on google drive
 */
router.get('/getDefaultFolder', async (ctx, next) => {
  // get files
  const body = await callGoogleAPI(ctx, {
    path: 'files/'
  });

  const files = body.files;
  folder = files.filter(
    ({ name }) => name == DEFAULT_DRIVE_FOLDER_NAME
  );
  if (folder.length === 0) {
    // no folder, create
    const body = await callGoogleAPI(ctx, {
      path: 'files/',
      body: {
        name: DEFAULT_DRIVE_FOLDER_NAME,
        mimeType: MIMETYPES.FOLDER
      }
    });
    ctx.body = body;
  }
  else {
    ctx.body = folder[0];
  }
});

/**
 * Get maxPost metadata from pageToken
 *    This is useful as we will fetch more post later on,
 *    and we prioritize the later post first
 * @param {int} maxPost - get a number of post, default to 5
 * @param {string} folderId - folderId
 * @param {string} pageToken - pageToken to query next posts
 */
router.get('/getPostMetadata', async (ctx, next) => {
  const {
    folderId = '',
    maxPost = 5,
    pageToken = '',
  } = ctx.query;

  if (folderId === '') {
    ctx.body = 'folderId must be provided to query the request';
    return;
  }
  if (maxPost < 5 || maxPost > 100) {
    ctx.body = 'maxPost must be in range(5, 100)';
    return;
  }

  const body = await callGoogleAPI(ctx, {
    path: 'files/',
    query: {
      q: `'${folderId}' in parents and mimeType = '${MIMETYPES.MARKDOWN}'`,
      orderBy: 'name desc',
      pageSize: maxPost,
      /// pageToken
    },
  })
  ctx.body = body;
});

/**
 * Get a Post
 * @param {string} postId - postId
 */
router.get('/getPost', async (ctx, next) => {
  const { postId = '' } = ctx.query;
  if (postId === '') {
    ctx.body = 'postId must be provided';
    return;
  }

  const content = await callGoogleAPI(ctx, {
    path: `files/${postId}`,
    query: {
      alt: 'media',
      mimeType: MIMETYPES.MARKDOWN
    },
    stream: true
  });

  if (typeof(content) !== 'string') {
    ctx.body = {
      error: true,
      message: 'cannot get file content'
    }
  }

  const metadata = await callGoogleAPI(ctx, {
    path: `files/${postId}`,
    query: {
      mimeType: MIMETYPES.MARKDOWN
    },
  });

  ctx.body = {
    ...metadata,
    markdown: metadataParser(content)
  }
});

module.exports = router;

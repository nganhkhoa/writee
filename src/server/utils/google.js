const fs = require('fs');

const got = require('got');
const getRawBody = require('raw-body');

const {
  GOOGLE_CREDS: {
    client_id,
    client_secret
  },
  DRIVE_API_URL,
  GOOGLE_REFRESH_TOKEN_API_URL
} = require('../../../config');

const callGoogleAPI = async ({
  google,
  path = '/',
  method = 'GET',
  ...p
}) => {
  console.log(`${DRIVE_API_URL}/${path} : ${JSON.stringify(p)}`)
  let streamSize = 0;
  const response = await got(`${DRIVE_API_URL}/${path}`, {
    headers: {
      Authorization: `Bearer ${google.access_token}`
    },
    ...p,
    json: true
  })
    .on('downloadProgress', progress => {
      // console.log(progress);
      streamSize = progress.transferred;
    })
    .on('error', (error, body, response) => {
      console.log('google API call error', error.message);
      return error;
    })
  ;

  if (p.stream)
    return await getRawBody(response, {
      encoding: 'utf-8'
    });
  return response.body;
}

refresh_token = async (ctx, google) => {
  const { body } = await got.post(GOOGLE_REFRESH_TOKEN_API_URL, {
    headers: {
      Authorization: `Bearer ${google.access_token}`
    },
    body: {
      grant_type: 'refresh_token',
      refresh_token: google.refresh_token,
      client_id: client_id,
      client_secret: client_secret
    },
    json: true
  });

  console.log(body);
  ctx.session.grant.response.access_token = body.access_token;
  ctx.session.google.access_token = body.access_token;

  console.log(ctx.session.google)
}


module.exports = async (ctx, p) => {
  p.google = ctx.google;
  let result;
  try {
    result =  await callGoogleAPI(p);
  }
  catch (err) {
    if (err.message === 'Response code 401 (Unauthorized)') {
      console.log('token expries, refresh token');
      console.log(ctx.google)
      await refresh_token(ctx, ctx.google);
      p.google = ctx.session.google;
      result = await callGoogleAPI(p);
    }
    else if (err.message === 'Response code 403 (Forbidden)') {
      console.log('Forbidden');
      result = {};
    }
    else {
      result = {}
    }
  }
  return result;
}

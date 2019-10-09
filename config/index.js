const fs = require('fs');
const traverse = require('traverse');

const NODE_ENV = process.env.NODE_ENV || 'development';

const GOOGLE_CREDS_FILE = 'config/google-credentials.json';
const GOOGLE_CREDS_RAW = JSON.parse(fs.readFileSync(GOOGLE_CREDS_FILE));
const GOOGLE_CREDS = GOOGLE_CREDS_RAW.installed;

const GRANT_CONFIG_FILE = 'config/grant.json'
const GRANT_CONFIG_RAW = JSON.parse(fs.readFileSync(GRANT_CONFIG_FILE));
const GRANT_CONFIG = traverse(GRANT_CONFIG_RAW[NODE_ENV]).map(function (path) {
  if (typeof(this.parent) === "undefined")
    return;
  if (this.parent.key === "google") {
    // google key
    if (this.key === "key")
      this.update(GOOGLE_CREDS.client_id);
    if (this.key === "secret")
      this.update(GOOGLE_CREDS.client_secret);
  }

  if (this.parent.key == "facebook") {
    // facebook key
  }
});

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';
const GOOGLE_REFRESH_TOKEN_API_URL = 'www.googleapis.com/oauth2/v4/token';
const DEFAULT_DRIVE_FOLDER_NAME = 'writee';

const MIMETYPES = {
  MARKDOWN: 'text/markdown',
  FOLDER: 'application/vnd.google-apps.folder'
};

module.exports = {
  GRANT_CONFIG,
  GOOGLE_CREDS,
  DRIVE_API_URL,
  GOOGLE_REFRESH_TOKEN_API_URL,
  DEFAULT_DRIVE_FOLDER_NAME,
  MIMETYPES
};

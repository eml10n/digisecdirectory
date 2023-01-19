const simpleOauth = require('simple-oauth2')

const SITE_URL = process.env.URL || 'https://digisec.directory'

/* Auth values */
const TOKEN_HOST = 'https://gitlab.com'
const TOKEN_URL =  'https://gitlab.com/oauth/token'
const USER_PROFILE_URL = 'https://gitlab.com/api/v1/user'
const AUTHORIZATION_URL = 'https://gitlab.com/oauth/authorize'
const REDIRECT_URL = `${SITE_URL}/.netlify/functions/auth-callback`

/* Env key name */
const clientIdKey = 'OAUTH_CLIENT_ID'
const clientSecretKey = 'OAUTH_CLIENT_SECRET'

const config = {
  /* values set in terminal session or in netlify environment variables */
  clientId: process.env[clientIdKey],
  clientSecret: process.env[clientSecretKey],
  /* OAuth API endpoints */
  tokenHost: TOKEN_HOST,
  authorizePath: AUTHORIZATION_URL,
  tokenPath: TOKEN_URL,
  profilePath: USER_PROFILE_URL,
  /* redirect_uri is the callback url after successful signin */
  redirect_uri: REDIRECT_URL,
}

function authInstance(credentials) {
  if (!credentials.client.id) {
    throw new Error(`MISSING REQUIRED ENV VARS. Please set ${clientIdKey}`)
  }
  if (!credentials.client.secret) {
    throw new Error(`MISSING REQUIRED ENV VARS. Please set ${clientSecretKey}`)
  }
  return simpleOauth.create(credentials)
}

module.exports = {
  /* Export config for functions */
  config: config,
  /* Create oauth2 instance to use in our functions */
  oauth: authInstance({
    client: {
      id: config.clientId,
      secret: config.clientSecret
    },
    auth: {
      tokenHost: config.tokenHost,
      tokenPath: config.tokenPath,
      authorizePath: config.authorizePath
    }
  })
}
import { OAuth } from 'oauth';

const electron = window.require('electron');
const shell = electron.shell;


export default class TwitterAuthenticator {
  constructor(consumerKey, consumerSecret) {
    this.oauth = new OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      consumerKey,
      consumerSecret,
      '1.0A',
      null,
      'HMAC-SHA1'
    );
  }

  openAuthorizeURL() {
    this.oauth.getOAuthRequestToken((error, oauthToken, oauthTokenSecret) => {
      if (error) { return; }
      const authUrl = `https://api.twitter.com/oauth/authorize?oauth_token=${oauthToken}`;
      shell.openExternal(authUrl);
      this.oauthRequestToken = oauthToken;
      this.oauthRequestTokenSecret = oauthTokenSecret;
    });
  }

  verifyPinCode(pinCode, callback) {
    function requestCallback(pinError, accessToken, accessTokenSecret) {
      callback(pinError, { accessToken, accessTokenSecret });
    }
    this.oauth.getOAuthAccessToken(
      this.oauthRequestToken,
      this.oauthRequestTokenSecret,
      pinCode,
      requestCallback
    );
  }
}

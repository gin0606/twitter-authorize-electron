import React from 'react';
import { Button, FormGroup, FormControl, ProgressBar } from 'react-bootstrap';
import TwitterAuthenticator from '../utils/TwitterAuthenticator';


const ENTER_KEY_CODE = 13;

export default class Login extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      oauthUrlOpened: false,
      inProgress: false,
      error: null,
    };

    this.openAuthorizeURL = this.openAuthorizeURL.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.verifyPinCode = this.verifyPinCode.bind(this);
  }

  onKeyDown(e) {
    if (e.keyCode !== ENTER_KEY_CODE) { return; }
    this.verifyPinCode();
  }

  openAuthorizeURL() {
    if (!this.consumerKey || !this.consumerSecret) { return; }
    this.oauthClient = new TwitterAuthenticator(
      this.consumerKey,
      this.consumerSecret,
    );
    this.oauthClient.openAuthorizeURL();
    this.setState({ oauthUrlOpened: true });
  }

  verifyPinCode() {
    this.setState({ inProgress: true });
    this.oauthClient.verifyPinCode(this.pinCode, (error, { accessToken, accessTokenSecret }) => {
      this.accessToken = accessToken;
      this.accessTokenSecret = accessTokenSecret;
      this.setState({
        oauthUrlOpened: false,
        inProgress: false,
        error,
      });
    });
  }

  render() {
    return (<div>
      {this.state.inProgress ? <ProgressBar active now={100} /> : null}
      <FormGroup validationState={this.state.error ? 'error' : null}>
        <FormControl
          type="text"
          placeholder="Consumer Key (API Key)"
          onChange={(e) => { this.consumerKey = e.target.value; }}
          disabled={this.state.oauthUrlOpened || this.state.inProgress}
        />
        <FormControl
          type="text"
          placeholder="Consumer Secret (API Secret)"
          onChange={(e) => { this.consumerSecret = e.target.value; }}
          disabled={this.state.oauthUrlOpened || this.state.inProgress}
        />
        <FormControl type="text" placeholder="Access Token" value={this.accessToken || ''} disabled />
        <FormControl type="text" placeholder="Access Token Secret" value={this.accessTokenSecret || ''} disabled />
        <FormControl
          type="text"
          placeholder={this.state.error ?
            `${this.state.error.data}[statusCode: ${this.state.error.statusCode}]`
            : 'Please enter PIN code'}
          onKeyDown={this.onKeyDown}
          onChange={(e) => { this.pinCode = e.target.value; }}
          disabled={!this.state.oauthUrlOpened || this.state.inProgress}
        />
        <Button
          bsStyle={!this.state.oauthUrlOpened ? 'default' : 'primary'}
          onClick={this.verifyPinCode}
          disabled={!this.state.oauthUrlOpened || this.state.inProgress}
          block
        >
          Verify PIN code
        </Button>
      </FormGroup>
      <Button
        bsStyle={this.state.oauthUrlOpened ? 'default' : 'primary'}
        onClick={this.openAuthorizeURL}
        disabled={this.state.inProgress}
        block
      >
        Open Twitter authorize URL
      </Button>
    </div>);
  }
}

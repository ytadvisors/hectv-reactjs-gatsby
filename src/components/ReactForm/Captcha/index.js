import React, { Component } from 'react';
import Recaptcha from 'react-recaptcha';
import './styles.scss';

export default class Captcha extends Component {
  constructor(props) {
    super(props);
    this.captchaKey = process.env.RE_CAPTCHA_SITE_KEY;
  }

  verifyCallback = () => {
    const { input: { name }, change } = this.props;
    change(name, true);
  };

  callback = () => {
    console.log('Done!!!!');
  };

  render() {
    const {
      input,
      display_errors,
      meta: { touched, error },
      options
    } = this.props;
    return (
      <div className="captcha">
        <Recaptcha
          sitekey={this.captchaKey}
          render="explicit"
          verifyCallback={this.verifyCallback}
          onloadCallback={this.callback}
          elementID={input.name}
        />
        {display_errors && (
          <div
            className="errors"
            dangerouslySetInnerHTML={{
              __html: touched && error ? error : '&nbsp;'
            }}
          />
        )}
      </div>
    );
  }
}

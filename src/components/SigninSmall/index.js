import React from 'react';
import { FaGoogle, FaFacebook } from 'react-icons/lib/fa';
import { Button } from 'react-bootstrap';
import SocialLoginButton from '../SocialLoginButton';
import SignUpForm from '../Forms/SignUpForm';
import RegisterForm from '../Forms/RegisterForm';

import { getSocialMenuObject } from '../../utils/helperFunctions';

import SocialLinks from '../SocialLinks';
import logo from '../../assets/blue_hec.png';
import './styles.scss';

export default props => {
  const {
    fbAppId,
    googleOauth2ClientId,
    social,
    openCreateAccount,
    openSignin,
    signinFunc,
    registerFunc,
    thirdPartySigninFunc,
    overlaySettings: { screen } = {}
  } = props;

  const failedLogin = () => {};

  const logout = () => {};

  const socialLinks = getSocialMenuObject(social, 25, '#002dc4');

  const getSigninButtons = () => (
    <ul>
      <li>
        <SocialLoginButton
          provider="google"
          appId={googleOauth2ClientId}
          onLoginSuccess={thirdPartySigninFunc}
          onLoginFailure={failedLogin}
          onLogoutSuccess={logout}
          width="100%"
          className="social-button"
          style={{ backgroundColor: 'rgb(190, 38, 18)' }}
        >
          <FaGoogle size="20" color="white" />
        </SocialLoginButton>
      </li>
      <li>
        <SocialLoginButton
          provider="facebook"
          appId={fbAppId}
          onLoginSuccess={thirdPartySigninFunc}
          onLoginFailure={failedLogin}
          onLogoutSuccess={logout}
          width="100%"
          className="social-button "
          style={{ backgroundColor: 'rgb(66, 103, 178)' }}
        >
          <FaFacebook size="20" color="white" />
        </SocialLoginButton>
      </li>
    </ul>
  );

  const getSigninContent = () => (
    <div className="col-md-12 signin">
      <div className="row signin-logo" style={{ marginTop: 10 }}>
        <img
          src={logo}
          alt="logo"
          style={{ margin: 'auto' }}
          className="img-responsive"
        />
        <div className="link-container">
          <SocialLinks links={socialLinks} />
        </div>
      </div>

      <div className="row text-center">
        <h2 style={{ color: '#555' }}>Welcome back!</h2>
      </div>
      <div className="row text-center padded connect-text">
        Connect now using
      </div>
      <div className="row signup-buttons text-center">{getSigninButtons()}</div>
      <div className="row text-center padded connect-text">Or</div>
      <div className="row">
        <div className="col-md-4 col-md-offset-4">
          <SignUpForm callbackFunc={signinFunc} />
        </div>
      </div>
      <div
        className="row"
        style={{
          fontSize: 14,
          fontFace: 'Arial, Helvetica, San Serif',
          fontWeight: 400
        }}
      >
        Don’t have a hec-tv Account?
        <Button onClick={openCreateAccount}>
          <span>Create one now</span>
        </Button>
      </div>
      <div
        className="row"
        style={{
          borderBottom: 'solid 1px #D3D3D3',
          fontSize: 14,
          fontFace: 'Arial, Helvetica, San Serif',
          fontWeight: 400
        }}
      >
        Why sign in to PBS?
      </div>
    </div>
  );

  const getRegisterContent = () => (
    <div className="col-md-12 register">
      <div className="row signin-logo" style={{ marginTop: 10 }}>
        <img
          src={logo}
          alt="logo"
          style={{ margin: 'auto' }}
          className="img-responsive"
        />
        <div className="link-container">
          <SocialLinks links={socialLinks} />
        </div>
      </div>

      <div className="row text-center">
        <h2 style={{ color: '#555' }}>Create your account</h2>
      </div>
      <div className="row text-center padded connect-text">
        Connect your Facebook or Google+ account
      </div>
      <div className="row signup-buttons text-center">{getSigninButtons()}</div>
      <div className="row text-center padded connect-text">Or</div>
      <div className="row">
        <div className="col-md-4 col-md-offset-4">
          <RegisterForm callbackFunc={registerFunc} />
        </div>
      </div>
      <div
        className="row"
        style={{
          borderBottom: 'solid 1px #D3D3D3',
          fontSize: 14,
          fontFace: 'Arial, Helvetica, San Serif',
          fontWeight: 400
        }}
      >
        Already have an account?
        <Button onClick={openSignin}>
          <span>Sign In</span>
        </Button>
      </div>
      <div
        className="row"
        style={{
          fontSize: 14,
          fontFace: 'Arial, Helvetica, San Serif',
          fontWeight: 400
        }}
      >
        By creating an account, you acknowledge that PBS may share your
        information with our member stations and our respective service
        providers, and that you have read and understand the Privacy Policy
        (opens in new window) and Terms of Use a(opens in new window).
      </div>
    </div>
  );

  return screen === 'signin' ? getSigninContent() : getRegisterContent();
};

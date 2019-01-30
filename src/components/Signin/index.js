import React from 'react';
import posed, { PoseGroup } from 'react-pose';
import { IoCloseCircled } from 'react-icons/lib/io';
import { FaGoogle, FaFacebook, FaArrowCircleRight } from 'react-icons/lib/fa';
import { MdAddCircle } from 'react-icons/lib/md';
import { Button } from 'react-bootstrap';
import SocialLoginButton from '../SocialLoginButton';
import SignUpForm from '../Forms/SignUpForm';
import RegisterForm from '../Forms/RegisterForm';

import { getSocialMenuObject } from '../../utils/helperFunctions';

import SocialLinks from '../SocialLinks';
import logo from '../../assets/blue_hec.png';
import './styles.scss';

const SigninContainer = posed.div({
  enter: {
    y: 0,
    left: 0,
    delay: 50,
    opacity: 1,
    overflowX: 'hidden',
    transition: {
      x: { type: 'spring', stiffness: 500, damping: 4 },
      default: { duration: 500 }
    }
  },
  exit: {
    x: 50,
    left: '100%',
    overflowX: 'hidden',
    opacity: 0,
    transition: { duration: 500 }
  }
});

const RegisterContainer = posed.div({
  enter: {
    y: 0,
    left: 0,
    delay: 50,
    opacity: 1,
    overflowX: 'hidden',
    transition: {
      x: { type: 'spring', stiffness: 500, damping: 4 },
      default: { duration: 500 }
    }
  },
  exit: {
    x: 50,
    left: '-100%',
    overflowX: 'hidden',
    opacity: 0,
    transition: { duration: 500 }
  }
});

export default props => {
  const {
    fbAppId,
    googleOauth2ClientId,
    social,
    pageOperation,
    closeSignin,
    openCreateAccount,
    openSignin,
    signinFunc,
    registerFunc
  } = props;

  const googleLogin = () => {};

  const facebookLogin = () => {};

  const failedLogin = () => {};

  const logout = () => {};

  const socialLinks = getSocialMenuObject(social, 25, '#002dc4');

  const getSigninButtons = () => (
    <ul>
      <li>
        <SocialLoginButton
          provider="google"
          appId={googleOauth2ClientId}
          onLoginSuccess={googleLogin}
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
          onLoginSuccess={facebookLogin}
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
    <SigninContainer className="signin" key="signin">
      <div className="container">
        <div className="close-container ">
          <ul className="pull-right row">
            <li>
              <Button className="pull-right" onClick={openCreateAccount}>
                <MdAddCircle size="22" color="darkgrey" />
                <span>Create account</span>
              </Button>
            </li>
            <li>
              <Button className="pull-right" onClick={closeSignin}>
                <IoCloseCircled size="22" color="darkgrey" />
                <span>Cancel</span>
              </Button>
            </li>
          </ul>
        </div>
        <div className="row signin-logo">
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
        <div className="row signup-buttons text-center">
          {getSigninButtons()}
        </div>
        <div className="row text-center padded connect-text">Or</div>
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <SignUpForm callbackFunc={signinFunc} />
          </div>
        </div>
      </div>
    </SigninContainer>
  );

  const getRegisterContent = () => (
    <RegisterContainer className="register" key="register">
      <div className="container">
        <div className="close-container ">
          <ul className="pull-right row">
            <li>
              <Button className="pull-right" onClick={openSignin}>
                <FaArrowCircleRight size="22" color="darkgrey" />
                <span>Signin</span>
              </Button>
            </li>
            <li>
              <Button className="pull-right" onClick={closeSignin}>
                <IoCloseCircled size="22" color="darkgrey" />
                <span>Cancel</span>
              </Button>
            </li>
          </ul>
        </div>
        <div className="row signin-logo">
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
        <div className="row signup-buttons text-center">
          {getSigninButtons()}
        </div>
        <div className="row text-center padded connect-text">Or</div>
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <RegisterForm callbackFunc={registerFunc} />
          </div>
        </div>
      </div>
    </RegisterContainer>
  );

  return (
    <PoseGroup>
      {[
        pageOperation === 'signin' && getSigninContent(),
        pageOperation === 'register' && getRegisterContent()
      ]}
    </PoseGroup>
  );
};

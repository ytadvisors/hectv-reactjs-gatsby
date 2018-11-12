import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Recaptcha from 'react-recaptcha';
import './styles.scss';

export default props => {
  const {
    input: { name },
    displayErrors,
    meta: { touched, error },
    change
  } = props;

  const verifyCallback = () => {
    change(name, true);
  };

  const callback = () => {
    console.log('Done!!!!');
  };

  return (
    <StaticQuery
      query={graphql`
        query captchaKeyQuery {
          wpSite: site {
            siteMetadata {
              captchaKey
            }
          }
        }
      `}
      render={data => (
        <div className="captcha">
          <Recaptcha
            sitekey={data.wpSite.siteMetadata.captchaKey}
            render="explicit"
            verifyCallback={() => verifyCallback()}
            onloadCallback={callback}
            elementID={name}
          />
          {displayErrors && (
            <div
              className="errors"
              dangerouslySetInnerHTML={{
                __html: touched && error ? error : '&nbsp;'
              }}
            />
          )}
        </div>
      )}
    />
  );
};

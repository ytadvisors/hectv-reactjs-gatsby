import React from 'react';
import { StaticQuery, graphql  } from 'gatsby';
import Recaptcha from 'react-recaptcha';
import './modules.scss';


export default (props) => {

  const verifyCallback = (props) => {
    const { input: { name }, change } = props;
    change(name, true);
  };

  const callback = () => {
    console.log('Done!!!!');
  };


  const {
    input,
    display_errors,
    meta: { touched, error }
  } = props;
  return (
    <StaticQuery
      query={graphql`
         query captchaKeyQuery{
          wpSite: site {
            siteMetadata{
              captchaKey
            }
          }
        }
      `}
      render={
        data => {
          return <div className="captcha">
            <Recaptcha
              sitekey={data.wpSite.siteMetadata.captchaKey}
              render="explicit"
              verifyCallback={() => verifyCallback(props)}
              onloadCallback={callback}
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
        }
      }
    />
  );
}
import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import _ from 'lodash';
import logo from '../../assets/white_hec.png';
import { getSocialMenuObject } from '../../utils/helperFunctions';
import SocialLinks from '../SocialLinks';

import './styles.scss';

const Footer = ({ footer, social }) => {
  const links = _.chunk(footer, footer.length / 2);
  const linkMap = links.map((obj, x) => ({
    id: x,
    obj
  }));
  const largeSocialLinks = getSocialMenuObject(social, 30, 'white');
  const socialLinks = getSocialMenuObject(social, 25, 'white');

  return (
    <section className="footer">
      <div className="container">
        <div className="row">
          <div className="text-center mobile">
            <div className="social-container">
              <SocialLinks links={largeSocialLinks} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-3 no-mobile">
            <div className="logo">
              <img src={logo} className="img-responsive" alt="logo" />
            </div>
            <div className="">
              <div className="social-container">
                <SocialLinks links={socialLinks} />
              </div>
            </div>
          </div>
          {linkMap.map(pageLinks => (
            <div key={pageLinks.id} className="col-xs-6 col-sm-3 no-padding">
              <ul>
                {pageLinks.obj.map(link => (
                  <li key={link.url}>
                    <Link to={link.url.replace(/https?:\/\/[^/]+/, '')}>
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

Footer.propTypes = {
  footer: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Footer;

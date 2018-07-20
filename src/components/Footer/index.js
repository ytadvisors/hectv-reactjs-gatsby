import React, { Component } from 'react';
import { Link } from "gatsby"
import PropTypes from 'prop-types';
import logo from './../../assets/white_hec.png';
import { getSocialMenuObject, isServer } from './../../utils/helperFunctions';
import SocialLinks from './../../components/SocialLinks';
import _ from 'lodash';

import './styles.scss';

export default class Footer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.isMobile = !isServer && window.innerWidth <= 500;
  }

  render() {
    const { footer, social } = this.props;
    let links = _.chunk(footer, footer.length / 2);
    let large_social_links = getSocialMenuObject(social, 30, 'white');
    let social_links = getSocialMenuObject(social, 25, 'white');

    return (
      <section className="footer">
        <div className="container">
          <div className="row">
            <div className="text-center mobile">
              <div className="social-container">
                <SocialLinks links={large_social_links} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-3 no-mobile">
              <div className="logo">
                <img src={logo} className="img-responsive" />
              </div>
              <div className="">
                <div className="social-container">
                  <SocialLinks links={social_links} />
                </div>
              </div>
            </div>
            {links.map((page_links, x) => (
              <div key={`footer-${x}`} className="col-xs-6 col-sm-3 no-padding">
                <ul>
                  {page_links.map((links, x) => (
                    <li key={`page-${x}`}>
                      <Link to={links.url.replace(/https?:\/\/[^/]+/, '')}>
                        {links.title}
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
  }
}

Footer.propTypes = {
  footer: PropTypes.array.isRequired
};

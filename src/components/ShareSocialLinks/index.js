import React from 'react';
import PropTypes from 'prop-types';
import { ShareButtons, generateShareIcon } from 'react-share';
import './styles.scss';

const {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const EmailIcon = generateShareIcon('email');

const ShareSocialLinks = ({ url, title }) => (
  <section className="share-social-links">
    <ul>
      <li>
        <FacebookShareButton url={url} quote={title} className="">
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      </li>
      <li>
        <TwitterShareButton url={url} title={title} className="">
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      </li>
      <li>
        <EmailShareButton
          url={url}
          subject={title}
          body={`${title} at ${url}`}
          className=""
        >
          <EmailIcon size={32} round />
        </EmailShareButton>
      </li>
    </ul>
  </section>
);

ShareSocialLinks.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default ShareSocialLinks;

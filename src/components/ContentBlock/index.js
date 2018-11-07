import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const ContentBlock = ({
  header,
  content,
  subheader,
  footer,
  type,
  data,
  style
}) => (
  <section className={`content-block ${type}`} style={style}>
    <article>
      <div className="content-header">
        <div
          className="main-header"
          dangerouslySetInnerHTML={{ __html: header }}
        />
        <div
          className="sub-header"
          dangerouslySetInnerHTML={{ __html: subheader }}
        />
      </div>
      <div>{data}</div>
      <div
        className="content-body"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div
        className="content-footer"
        dangerouslySetInnerHTML={{ __html: footer }}
      />
    </article>
  </section>
);

ContentBlock.propTypes = {
  header: PropTypes.string.isRequired,
  subheader: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  footer: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default ContentBlock;

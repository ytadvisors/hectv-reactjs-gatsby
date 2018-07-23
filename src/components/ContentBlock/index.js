import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './modules.scss';

export default class ContentBlock extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      header,
      content,
      subheader,
      footer,
      type,
      data,
      style
    } = this.props;
    return (
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
  }
}

ContentBlock.propTypes = {
  header: PropTypes.string,
  subheader: PropTypes.string,
  content: PropTypes.string,
  footer: PropTypes.string,
  type: PropTypes.string.isRequired
};

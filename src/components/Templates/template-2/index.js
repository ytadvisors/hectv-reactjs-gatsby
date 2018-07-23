import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Content from '../../Content';
import './modules.scss';

export default class Template2 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { page_content } = this.props;

    return (
      <section className="template-2">
        <section className="col-md-12">
          <Content post={page_content} />
        </section>
      </section>
    );
  }
}

Template2.propTypes = {
  page_content: PropTypes.object.isRequired
};

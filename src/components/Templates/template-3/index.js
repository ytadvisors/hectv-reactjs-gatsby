import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentBlock from '../../ContentBlock';
import Map from '../../Map';
import ContactForm from '../../Forms/ContactForm';
import './modules.scss';

export default class Template3 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      page_content: {
        phone_number,
        address,
        fax_number,
        directions,
        opportunities
      },
      mapKey,
      callbackFunc
    } = this.props;

    return (
      <section className="template-3">
        <ContactForm callbackFunc={callbackFunc} />
        <Map mapKey={mapKey} />
        <div className="row info-block">
          <div className="col-md-6">
            <ContentBlock
              header={address}
              subheader={`Phone ${phone_number}<br/>Fax ${fax_number}`}
              content="<strong>WHERE TO FIND US</strong>"
              footer={directions}
              type="blue-block"
              style={{ minHeight: '320px' }}
            />
          </div>
          <div className="col-md-6">
            <ContentBlock
              header="Opportunities"
              content={opportunities}
              type="white-block"
              style={{ minHeight: '320px' }}
            />
          </div>
        </div>
      </section>
    );
  }
}

Template3.propTypes = {
  page_content: PropTypes.object.isRequired,
  callbackFunc: PropTypes.func.isRequired
};

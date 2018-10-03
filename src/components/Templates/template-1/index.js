import React, { Component } from 'react';
import ContentBlock from '../../ContentBlock';
import VideoPlayer from '../../VideoPlayer';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './styles.scss';

export default class Template1 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      page_content: {
        content,
        address,
        phone_number,
        fax_number,
        tv_providers,
        team,
        video_id
      }
    } = this.props;

    const video_url = `https://vimeo.com/${video_id}`;
    return (
      <section className="template-1">
        <div className="col-md-12 template-row">
          <VideoPlayer url={video_url} container_style={{ padding: '0' }} />
        </div>
        <div className="row clearfix">
          <div className="col-md-6">
            <ContentBlock
              header="About"
              content={content}
              type="white-block"
              style={{ minHeight: '420px' }}
            />
          </div>
          <div className="col-md-6">
            <ContentBlock
              header={address}
              subheader={`Phone ${phone_number}<br/>Fax ${fax_number}`}
              style={{ minHeight: '420px' }}
              data={tv_providers.map((tv, x) => (
                <div key={`provider-${x}`}>
                  <strong><div dangerouslySetInnerHTML={{ __html: tv.provider }}/></strong>
                  <br />
                  <div dangerouslySetInnerHTML={{ __html: tv.channel }} />
                </div>
              ))}
              type="blue-block"
            />
          </div>
          <div className="col-md-12 ">
            <ContentBlock
              header="Our Team"
              data={_.chunk(team, 3).map((row, i) => (
                <ul key={`row-${i}`} className="row no-list">
                  {' '}
                  {row.map((member, x) => (
                    <li className="col-md-4" key={`member-${x}`}>
                      <strong>{member.name}</strong>
                      <br />
                      <i>{member.position}</i>
                      <br />
                      <i>{member.email}</i>
                    </li>
                  ))}
                </ul>
              ))}
              type="white-block clearfix"
            />
          </div>
        </div>
      </section>
    );
  }
}

Template1.propTypes = {
  page_content: PropTypes.object.isRequired
};

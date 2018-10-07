import React from 'react';
import { Modal } from 'react-bootstrap';
import VideoPlayer from './../../components/VideoPlayer';
import { closeOverlayAction } from './../../store/actions/pageActions';

import logo from './../../assets/white_hec.png';

export default (props) => {

  const {
    open_overlay,
    dispatch,
    overlay_settings: {
      video,
      img,
      content
    } = {} 
  } = props;

  const closeOverlay = () => {
    dispatch(closeOverlayAction());
  };

  return (
    <Modal
      show={open_overlay === 'basic'}
      onHide={closeOverlay}
      aria-labelledby="page-modal"
      className="page-modal"
    >
      <Modal.Header closeButton className="modal-header">
        <Modal.Title id="modal-header">
          <div className="col-xs-2 no-padding col-xs-offset-1">
            <img src={logo} className="img-responsive" />
          </div>

          <div className="col-xs-8 brand-details no-padding">
            <div className="brand-text" >
              <div>St. Louis' home of Education</div>
              <div>Arts, and Culture</div>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body" style={{ padding: '0' }}>
        { img &&
          <img
            src={img}
            className="img-responsive "
            style={{width: '100%'}}
          />
        }
        { video &&
        <VideoPlayer
          url={video}
          container_style={{padding: '0', width: '100%'}}
          playing
        />
        }
        { content &&
          <div className="overlay-content">{content}</div>
        }
      </Modal.Body>
    </Modal>
  );
};
import React from 'react';
import { Modal } from 'react-bootstrap';
import SigninSmall from '../../components/SigninSmall';
import { closeOverlayAction } from '../../store/actions/pageActions';

import logo from '../../assets/white_hec.png';

export default props => {
  const { openOverlay, dispatch } = props;

  const closeOverlay = () => {
    dispatch(closeOverlayAction());
  };

  const title = "St. Louis' home of Education";
  return (
    <Modal
      show={openOverlay === 'signin'}
      onHide={closeOverlay}
      aria-labelledby="page-modal"
      className="page-modal"
    >
      <Modal.Header
        closeButton
        className="modal-header"
        style={{ height: 'auto', padding: 7 }}
      >
        <Modal.Title id="modal-header">
          <div className="col-xs-2 no-padding col-xs-offset-1">
            <img
              src={logo}
              className="img-responsive"
              alt="logo"
              style={{ width: 50, height: 50 }}
            />
          </div>

          <div className="col-xs-8 brand-details no-padding">
            <div className="brand-text" style={{ fontSize: 18 }}>
              <div>{title}</div>
              <div>Arts, and Culture</div>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body" style={{ padding: '0' }}>
        <div className="overlay-content">
          <SigninSmall {...props} />
        </div>
      </Modal.Body>
    </Modal>
  );
};

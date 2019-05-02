import React, { Component, Fragment } from 'react';
import { navigate } from 'gatsby';
import { connect } from 'react-redux';
import Header from '../components/Header';
import Banner from '../components/Banner';
import LoginModal from './Modals/LoginModal';
import { loadLiveVideosAction } from '../store/actions/postActions';
import { openOverlayAction } from '../store/actions/pageActions';
import { logoutAction } from '../store/actions/accountActions';

import { BasicModal } from './Modals';

class HeaderContainer extends Component {
  componentDidMount() {
    this.mounted = true;
    this.loadLive();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  loadLive = () => {
    if (this.mounted) {
      const { dispatch } = this.props;
      dispatch(loadLiveVideosAction());
    }
  };

  searchFunc = () => {
    const { pageForm: { search: { values } = {} } = {} } = this.props;

    if (values && values.search) {
      navigate(`/search/${values.search}`);
    }
  };

  openSignin = () => {
    const { dispatch } = this.props;
    dispatch(
      openOverlayAction('signin', {
        screen: 'signin'
      })
    );
  };

  logoutFunc = () => {
    const { dispatch } = this.props;
    dispatch(logoutAction('reload_page'));
  };

  render() {
    const { liveVideos, social, fbAppId, googleOauth2ClientId } = this.props;

    return (
      <Fragment>
        <LoginModal
          social={social}
          fbAppId={fbAppId}
          googleOauth2ClientId={googleOauth2ClientId}
          {...this.props}
        />
        <BasicModal {...this.props} />
        <Header
          {...this.props}
          searchFunc={this.searchFunc}
          openSignin={this.openSignin}
          logoutFunc={this.logoutFunc}
        />
        <Banner liveVideos={liveVideos} />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  pageForm: state.form,
  openOverlay: state.pageReducers.openOverlay,
  liveVideos: state.postReducers.liveVideos,
  overlaySettings: state.pageReducers.overlaySettings,
  pageOperation: state.pageReducers.pageOperation
});

export default connect(mapStateToProps)(HeaderContainer);

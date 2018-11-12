import React, { Component } from 'react';
import { navigate } from 'gatsby';
import { connect } from 'react-redux';
import Header from '../components/Header';
import Banner from '../components/Banner';

import { BasicModal } from './Modals';

class HeaderContainer extends Component {
  searchFunc = () => {
    const { pageForm: { search: { values } = {} } = {} } = this.props;

    if (values && values.search) {
      navigate(`/search/${values.search}`);
    }
  };

  render() {
    return (
      <section>
        <BasicModal {...this.props} />
        <Header {...this.props} searchFunc={this.searchFunc} />
        <Banner {...this.props} />
      </section>
    );
  }
}

const mapStateToProps = state => ({
  pageForm: state.form,
  openOverlay: state.pageReducers.openOverlay,
  overlaySettings: state.pageReducers.overlaySettings
});

export default connect(mapStateToProps)(HeaderContainer);

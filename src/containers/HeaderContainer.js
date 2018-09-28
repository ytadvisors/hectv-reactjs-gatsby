import React, {Component} from "react";
import { push } from "gatsby"
import { connect } from 'react-redux';
import Header from "./../components/Header";
import Banner from "./../components/Banner";

import {
  BasicModal
} from "./Modals"

class HeaderContainer extends Component {
  constructor(props) {
    super(props);
    this.searchFunc = this.searchFunc.bind(this);
  }

  searchFunc(){
    const { page_form } = this.props;
    let values = page_form.search.values;
    if (values && values.search) {
      push(`/search/${values.search}`);
    }
  }

  render() {
    return <section>
      <BasicModal {...this.props} />
      <Header {...this.props} searchFunc={this.searchFunc}/>
      <Banner {...this.props} />
    </section>
  }
}

const mapStateToProps = (state) => ({
  page_form: state.form,
  open_overlay : state.pageReducers.open_overlay,
  overlay_settings : state.pageReducers.overlay_settings
});

export default connect(mapStateToProps)(HeaderContainer);

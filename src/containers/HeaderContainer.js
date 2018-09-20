import React, {Component} from "react";
import { push } from "gatsby"
import { connect } from 'react-redux';
import Header from "./../components/Header";
import Banner from "./../components/Banner";

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
      <Header {...this.props} searchFunc={this.searchFunc}/>
      <Banner {...this.props} />
    </section>
  }
}

const mapStateToProps = (state) => ({
  page_form: state.form
});

export default connect(mapStateToProps)(HeaderContainer);

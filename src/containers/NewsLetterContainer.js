import React, {Component} from "react";

import { connect } from 'react-redux';
import addToMailchimp from 'gatsby-plugin-mailchimp'
import {
  openOverlayAction
} from './../store/actions/pageActions';
import NewsLetter from './../components/NewsLetter';

class NewsLetterContainer extends Component {
  constructor(props) {
    super(props);
  }

  subscribe = async (values) => {
    try {
      const {
        dispatch
      } = this.props;

      /*if (values["newsletter-captcha"])
       delete(values["newsletter-captcha"]);
       await addToMailchimp(values["EMAIL"], values);*/

      dispatch(openOverlayAction('basic', {
        content : <div className="text-center" style={{
          padding: "1.2em 3em 2.8em",
          lineHeight: "2em",
          background: "#ddecff"
        }}>
          <div>Congratulations! You successfully subscribed to our newsletter.</div>
        </div>
      }));
    } catch(err){

    }
  };

  render() {
    return <NewsLetter subscribe={this.subscribe} />
  }
}

const mapStateToProps = (state) => ({
  page_form: state.form
});

export default connect(mapStateToProps)(NewsLetterContainer);

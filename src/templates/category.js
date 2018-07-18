import React, {Component} from "react";
import { graphql } from "gatsby"
import { connect } from 'react-redux';

import SEO from "./../components/SEO";
import Layout from "./../components/Layout"
import CategoryNav from './../components/SubNavigation/CategoryNav';

import "./../utils/cssDependencies";


class Category extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {data} = this.props;
    data.wpCategory.content = "";
    if (data.wpCategory.description)
      data.wpCategory.content = data.wpCategory.description;

    let description = data.wpCategory.content || "On Demand Arts, Culture &amp; Education Programming";

    return <div>
      <SEO
        {...{
          title: `HEC-TV | ${data.wpCategory.name}`,
          image: "",
          description: description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 130) + '...',
          url: process.env.SITE_HOST,
          pathname: data.wpCategory.link.replace(/https?:\/\/[^/]+/, ''),
          site_name: "hectv.org",
          author: "hectv",
          twitter_handle: "@hec_tv"
        }}
      />
      <Layout  {...this.props}>
        <section>
          <CategoryNav slug={data.wpCategory.slug}/>
        </section>
      </Layout>
    </div>
  }
}

const mapStateToProps = state => ({
  values: state.form.newsletter.values
});

export default connect(mapStateToProps)(Category);

export const query = graphql`
   query categoryQuery ($slug: String!){
     wpCategory: wordpressCategory (slug : { eq : $slug }){
      slug
      link
      name
      description
    }
   }
`;
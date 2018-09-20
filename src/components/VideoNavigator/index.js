import React, { Component } from 'react';
import _ from 'lodash';
import defaultImage from './../../assets/nothumbnail.png';
import './styles.scss';
import { Link } from 'gatsby';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import CommentForm from './../../components/Forms/CommentForm';

export default class VideoNavigator extends Component {
  constructor(props) {
    super(props);
    this.truncate = this.truncate.bind(this);
    this.getContent = this.getContent.bind(this);
    this.state = { current_tab: 'Related' };
  }

  truncate(excerpt, truncateLength) {
    return excerpt.length > truncateLength
      ? excerpt.substr(0, truncateLength - 1) + '&hellip;'
      : excerpt;
  }

  getContent(nav_selection, entry, x = 0) {
    if (Array.isArray(entry)) {
      return entry.map(new_entry =>
        this.getContent(nav_selection, new_entry, ++x)
      );
    } else {
      const { thumbnail_class, content_class, truncate } = nav_selection;
      const { thumbnail, title, author } = entry;
      return (
        <div key={`${title}-${x}`} className={`tab-${x}`}>
          <div className={thumbnail_class}>
            <img src={thumbnail || defaultImage} alt="Entry thumbnail" />
          </div>
          <div className={content_class}>
            <div className="author-name">{author}</div>
            <div
              className="title"
              dangerouslySetInnerHTML={{
                __html: truncate ? this.truncate(title, 55) : title
              }}
            />
          </div>
        </div>
      );
    }
  }

  render() {
    const {
      tabs,
      callbackFunc,
      selected,
      page,
      current_navigation_tab,
      changeNavigationTab
    } = this.props;

    if (current_navigation_tab && tabs[current_navigation_tab]) {
      let nav_selection = tabs[current_navigation_tab];
      let navigation_links = _.keys(tabs);
      const { is_link } = nav_selection;

      return (
        <section className="video-navigator row">
          <div className="row">
            <ul className="navigator-tabs pull-right">
              {navigation_links.map((title, i) => (
                <li
                  key={`navigator-tab-${i}`}
                  onClick={() => changeNavigationTab(title)}
                  className={current_navigation_tab === title ? 'active' : ''}
                >
                  {title}
                </li>
              ))}
            </ul>
          </div>
          {nav_selection.editor ? (
            <CommentForm callbackFunc={callbackFunc} />
          ) : (
            ''
          )}
          <div className="row navigator-container">
            <div className="col-md-12 ">
              <ul className="entry-list">
                {nav_selection.grouped_entries.map((entry, i) => {
                  if (is_link) {
                    const { slug } = entry;
                    return (
                      <li
                        key={`entry-list-${i}`}
                        className={selected == slug ? 'active' : ' '}
                      >
                        <Link to={`/${page}/${slug}`}>
                          {this.getContent(nav_selection, entry)}
                        </Link>
                      </li>
                    );
                  } else {
                    return (
                      <li key={`entry-list-${i}`}>
                        {this.getContent(nav_selection, entry)}
                      </li>
                    );
                  }
                })}
              </ul>
              {(nav_selection => {
                let num_entries = nav_selection.entries.length;
                if (
                  num_entries > 0 &&
                  num_entries < nav_selection.num_results
                ) {
                  return (
                    <div>
                      <div className="row result-count pull-right">
                        {is_link
                          ? `${num_entries} of ${nav_selection.num_results} Results`
                          : ''}
                      </div>
                      <div className="row load-more-container">
                        <Button
                          className="btn btn-secondary btn-load-more"
                          onClick={nav_selection.loadMore}
                        >
                          {' '}
                          Load More
                        </Button>
                      </div>
                    </div>
                  );
                }
              })(nav_selection)}
            </div>
          </div>
        </section>
      );
    }
    return <section className="video-navigator row" />;
  }
}

VideoNavigator.propTypes = {
  tabs: PropTypes.object.isRequired,
  callbackFunc: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
  current_navigation_tab: PropTypes.string.isRequired,
  changeNavigationTab: PropTypes.func.isRequired,
  page: PropTypes.string.isRequired
};

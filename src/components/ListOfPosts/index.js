import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { Button } from 'react-bootstrap';
import defaultImage from './../../assets/nothumbnail.png';
import playButton from './../../assets/play-button.png';
import * as Material from 'react-icons/lib/md';
import * as Ionicons from 'react-icons/lib/io';
import texture from './../../assets/texture.jpg';

import './styles.scss';

export default class ListOfPosts extends Component {
  constructor(props) {
    super(props);
    this.truncate = this.truncate.bind(this);
    this.getRows = this.getRows.bind(this);
    this.getNumColumns = this.getNumColumns.bind(this);
    this.getColumnContent = this.getColumnContent.bind(this);
    this.getThumbNail = this.getThumbNail.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.getTitle = this.getTitle.bind(this);
    this.getContent = this.getContent.bind(this);
    this.getExcerpt = this.getExcerpt.bind(this);
    this.getContentDetails = this.getContentDetails.bind(this);
    this.getColumnLayout = this.getColumnLayout.bind(this);
    this.resize = this.resize.bind(this);

    //Layout
    this.getSingleColumnPost = this.getSingleColumnPost.bind(this);
    this.getSingleColumnWallpaper = this.getSingleColumnWallpaper.bind(this);
    this.state = {
      isMobile: false
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.setState({ isMobile: window.innerWidth <= 500 });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize() {
    this.setState({ isMobile: window.innerWidth <= 500 });
  }

  truncate(excerpt, truncateLength) {
    return excerpt && excerpt.length > truncateLength
      ? excerpt.substr(0, truncateLength) + '&hellip;'
      : excerpt;
  }

  getThumbNail(thumbnail, type, format, slug) {
    return (
      <Link to={`/${type}/${slug}`} className="thumbnail-link">
        {format === 'video' && <img src={playButton} className="play-icon" />}
        <img
          src={thumbnail || defaultImage}
          className="img-responsive full-width thumbnail-img"
          alt=""
        />
      </Link>
    );
  }

  getCategories(categories, link) {
    return (
      <p>
        {categories.map((category, x) => (
          <span className="category-info" key={`category-${x}`}>
            <Link
              to={`/${link.page}/${category.slug}`}
              dangerouslySetInnerHTML={{
                __html: category.cat_name
              }}
            />
          </span>
        ))}
      </p>
    );
  }

  getTitle(display_type, title, type, slug, layout) {
    let title_type = layout === '3 Columns' ? 'small_title' : '';
    if (display_type === 'Wallpaper') {
      return (
        <p>
          <span
            className={`blog-title ${title_type}`}
            dangerouslySetInnerHTML={{
              __html: title
            }}
          />
        </p>
      );
    } else
      return (
        <p>
          <Link to={`/${type}/${slug}`}>
            <span
              className={`blog-title ${title_type}`}
              dangerouslySetInnerHTML={{
                __html: title
              }}
            />
          </Link>
        </p>
      );
  }

  getExcerpt(display_type, layout, type, excerpt) {
    let icon = '';
    if (excerpt) {
      if (
        display_type === 'Wallpaper' ||
        (layout !== '2 Columns' && layout !== '3 Columns')
      ) {
        switch (type) {
          case 'events':
            icon = <Material.MdLocationOn size="25" color="#4ea2ea" />;
            break;
        }
        return (
          <div>
            {icon}
            <span
              className="blog-content"
              dangerouslySetInnerHTML={{
                __html: excerpt
              }}
            />
          </div>
        );
      }
    }
    return '';
  }

  getContentDetails(display_type, layout, content_details) {
    if (content_details) {
      if (
        display_type === 'Wallpaper' ||
        (layout !== '2 Columns' && layout !== '3 Columns')
      ) {
        return (
          <span
            className="content-details"
            dangerouslySetInnerHTML={{
              __html: ' ' + this.truncate(content_details, 163)
            }}
          />
        );
      }
    }
    return '';
  }

  getContent(display_type, layout, type, excerpt, content_details) {
    return (
      <div>
        {this.getExcerpt(display_type, layout, type, excerpt)}
        {this.getContentDetails(display_type, layout, content_details)}
      </div>
    );
  }

  getColumnContent(post, link, display_type, layout) {
    const {
      slug,
      title,
      excerpt,
      content_details,
      categories,
      type,
      date
    } = post;
    let category_list = !categories ? [] : categories;
    return (
      <div>
        {date && (
          <div className="blog-meta">
            {this.getDate(display_type, layout, post)}
          </div>
        )}
        <div className="blog-excerpt">
          {this.getCategories(category_list, link)}
          {this.getTitle(display_type, title, type, slug, layout)}
          {this.getContent(
            display_type,
            layout,
            type,
            excerpt,
            content_details
          )}
        </div>
      </div>
    );
  }

  getDate(display_type, layout, post) {
    const { date } = post;
    if (date) {
      return (
        <div className="blog-info">
          <Ionicons.IoCalendar size="20" color="white" />
          <span
            className="date"
            dangerouslySetInnerHTML={{
              __html: date
            }}
          />
        </div>
      );
    }
    return '';
  }

  getSingleColumnPost(post, content) {
    const { slug, small_thumbnail, type, format } = post;
    return (
      <table className="no-spacing">
        <tbody>
          <tr>
            <td className="col-xs-7">{content}</td>
            <td
              className="col-xs-5"
              style={{ padding: '10px', paddingBottom: '30px' }}
            >
              {this.getThumbNail(small_thumbnail, type, format, slug)}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  getSingleColumnWallpaper(post, content) {
    const { thumbnail, type, slug, redirect } = post;
    return (
      <table className="no-spacing">
        <tbody>
          <tr>
            <td className="col-md-12 wallpapercontainer">
              <div
                className="wallpaper"
                style={{ backgroundImage: `url(${thumbnail || defaultImage})` }}
              >
                {(redirect && (
                  <a
                    href={redirect}
                    style={{ display: 'block' }}
                    target="_blank"
                  >
                    <div className="gradient" />
                    <div className="texture" />
                    <div className="content">{content}</div>
                  </a>
                )) || (
                  <Link to={`/${type}/${slug}`}>
                    <div className="gradient" />
                    <div className="texture" />
                    <div className="content">{content}</div>
                  </Link>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  getFeaturedPost(post, content) {
    const { slug, thumbnail, small_thumbnail, type, format } = post;
    return (
      <div className="featured-block">
        {this.getThumbNail(
          this.state.isMobile ? small_thumbnail : thumbnail,
          type,
          format,
          slug
        )}
        {content}
      </div>
    );
  }

  getFeaturedWallpaper(post, content) {
    const { slug, thumbnail, small_thumbnail, type, redirect } = post;
    let link = redirect || `/${type}/${slug}`;

    let bg_thumbnail = this.state.isMobile ? small_thumbnail : thumbnail;
    return (
      <div className="featured-block">
        <div
          className="wallpaper"
          style={{ backgroundImage: `url(${bg_thumbnail})` }}
        >
          <Link to={link}>
            <div className="gradient" />
            <div className="texture" />
            <div className="content">{content}</div>
          </Link>
        </div>
      </div>
    );
  }

  getPost(layout, post, content) {
    const { slug, small_thumbnail, type, format } = post;
    return (
      <div>
        <div className={`thumbnail-${layout.replace(' ', '-').toLowerCase()}`}>
          {this.getThumbNail(small_thumbnail, type, format, slug)}
        </div>
        {content}
      </div>
    );
  }

  getWallpaper(post, content) {
    const { slug, small_thumbnail, type, redirect } = post;
    let link = redirect || `/${type}/${slug}`;

    return (
      <div
        className="wallpaper"
        style={{ backgroundImage: `url(${small_thumbnail})` }}
      >
        <Link to={link}>
          <div className="gradient" />
          <div className="texture" />
          <div className="content">{content}</div>
        </Link>
      </div>
    );
  }

  getColumnLayout(layout, display_type, post, link, num_rows) {
    let content = this.getColumnContent(post, link, display_type, layout);
    switch (layout) {
      case 'Single Column':
        switch (display_type) {
          case 'Post':
            return this.getSingleColumnPost(post, content);
          case 'Wallpaper':
            return this.getSingleColumnWallpaper(post, content);
          default:
            return this.getSingleColumnPost(post, content);
        }
      case 'Featured':
        switch (display_type) {
          case 'Post':
            return this.getFeaturedPost(post, content, this.state.isMobile);
          case 'Wallpaper':
            return this.getFeaturedWallpaper(
              post,
              content,
              this.state.isMobile
            );
          default:
            return this.getFeaturedPost(post, content, this.state.isMobile);
        }
      default:
        switch (display_type) {
          case 'Post':
            return this.getPost(`${num_rows}-columns`, post, content);
          case 'Wallpaper':
            return this.getWallpaper(post, content);
          default:
            return this.getPost(`${num_rows}-columns`, post, content);
        }
    }
  }

  getRows(
    layout,
    display_type,
    row_of_columns,
    link,
    table_style,
    resize_rows
  ) {
    return (
      <table className={`main-table`} style={table_style}>
        <tbody>
          {row_of_columns.map((current_row, x) => (
            <tr key={`row-${x}`} className="main-row ">
              {current_row.map((post, y) => {
                return (
                  <td key={`col ${x}${y}`} className="main-col col-xs-4">
                    <div className="no-padding post-preview">
                      {this.getColumnLayout(
                        layout,
                        display_type,
                        post,
                        link,
                        resize_rows && current_row.length
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  getNumColumns(layout) {
    let num_columns = 1;
    switch (layout) {
      case '2 Columns':
        num_columns = 2;
        break;
      case '3 Columns':
        num_columns = 3;
        break;
      default:
        num_columns = 1;
        break;
    }

    return num_columns;
  }

  render() {
    let main_content = '';
    let remaining_posts = '';
    let default_layout = 'Single Column';
    let display_type = 'Post';
    let num_columns = 1;
    const {
      num_results,
      loadMore,
      posts,
      link,
      title,
      design,
      style,
      resize_rows
    } = this.props;
    if (posts.length > 0) {
      let posts_clone = _.clone(posts);
      let page_design = { new_row_layout: [] };
      let table_style = {};

      if (design) {
        if (design.default_row_layout)
          default_layout = design.default_row_layout;
        if (design.default_display_type)
          display_type = design.default_display_type;
        if (design.new_row_layout && design.new_row_layout.length > 0) {
          table_style =
            design.new_row_layout.length > 1 && !this.state.isMobile
              ? { borderSpacing: '6px' }
              : {};
        }
        page_design = design;
      }
      main_content =
        page_design.new_row_layout &&
        page_design.new_row_layout.map((layout, x) => {
          let current_layout = this.state.isMobile
            ? 'Featured'
            : layout.row_layout;
          let current_display = layout.display_type;
          num_columns = this.getNumColumns(current_layout);
          let row = _.slice(posts_clone, 0, num_columns);
          let row_of_columns = _.chunk(row, num_columns);
          posts_clone.splice(0, num_columns);
          return (
            <div key={`table-${x}`}>
              {this.getRows(
                current_layout,
                current_display,
                row_of_columns,
                link,
                table_style,
                !!resize_rows
              )}
            </div>
          );
        });

      if (posts_clone.length > 0) {
        let current_layout = this.state.isMobile ? 'Featured' : default_layout;
        let current_display = display_type;
        let remaining_rows = _.chunk(
          posts_clone,
          this.getNumColumns(current_layout)
        );
        table_style = !this.state.isMobile ? { borderSpacing: '6px' } : {};
        remaining_posts = remaining_rows.map((row, x) => (
          <div key={`row-${x}`}>
            {this.getRows(
              current_layout,
              current_display,
              [row],
              link,
              table_style,
              !!resize_rows
            )}
          </div>
        ));
      }
      return (
        <section className="post-list-container clearfix" style={style}>
          {title ? <div className="title">{title}</div> : ''}
          <article className="hidden">
            <p>{num_results} results found</p>
          </article>
          {main_content}
          {remaining_posts}
          {(row_of_columns => {
            let num_displayed = row_of_columns.length;
            if (loadMore && num_displayed > 0 && num_displayed < num_results) {
              return (
                <div className="load-more-container row">
                  <Button
                    className="btn btn-primary btn-load-more"
                    onClick={loadMore}
                  >
                    {' '}
                    Load More
                  </Button>
                </div>
              );
            }
          })(posts)}
        </section>
      );
    }
    return <section />;
  }
}

ListOfPosts.propTypes = {
  posts: PropTypes.array.isRequired,
  link: PropTypes.object.isRequired,
  num_results: PropTypes.number.isRequired
};

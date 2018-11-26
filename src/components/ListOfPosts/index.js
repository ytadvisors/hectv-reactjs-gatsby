import React, { Component } from 'react';
import { Link } from 'gatsby';
import _ from 'lodash';
import * as Material from 'react-icons/lib/md';
import * as Ionicons from 'react-icons/lib/io';
import LazyLoad from 'react-lazyload';
import defaultImage from '../../assets/nothumbnail.png';
import playButton from '../../assets/play-button.png';
import { isServer, getEventDate } from '../../utils/helperFunctions';

import './styles.scss';

export default class ListOfPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: false
    };
  }

  componentDidMount() {
    if (!isServer) window.addEventListener('resize', this.resize);
    this.setState({ isMobile: !isServer && window.innerWidth <= 500 });
  }

  componentWillUnmount() {
    if (!isServer) window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    this.setState({ isMobile: !isServer && window.innerWidth <= 500 });
  };

  truncate = (excerpt, truncateLength) =>
    excerpt && excerpt.length > truncateLength
      ? `${excerpt.substr(0, truncateLength)}&hellip;`
      : excerpt;

  getThumbNail = (thumbnail, isVideo, link) => (
    <Link to={link} className="thumbnail-link">
      {isVideo && <img src={playButton} className="play-icon" alt="play" />}
      <LazyLoad height={200}>
        <img
          src={thumbnail || defaultImage}
          className="img-responsive full-width thumbnail-img"
          alt=""
        />
      </LazyLoad>
    </Link>
  );

  getLink = post => {
    const { link: { page } = {} } = this.props;
    const { postName, slug, redirect } = post;
    return redirect || postName ? `/${page}/${postName}` : `/${page}/${slug}`;
  };

  getImgSrc = (post, type) => {
    const { thumbnail, acf = {} } = post;

    const { coverImage, videoImage, postHeader, eventImage } = acf || {};
    const isVideo = post.acf && post.acf.isVideo;

    if (thumbnail) return thumbnail;
    if (coverImage) return coverImage;
    if (videoImage || postHeader || eventImage) {
      let img = '';
      if (isVideo) {
        img = videoImage;
      } else {
        img = postHeader || eventImage;
      }
      if (img) {
        const {
          sizes: { medium, mediumLarge }
        } = img;
        switch (type) {
          case 'small':
            return medium;
          default:
            return mediumLarge;
        }
      }
    }
    return defaultImage;
  };

  getCategories = categories => (
    <p>
      {categories.map(category => (
        <span className="category-info" key={category.link}>
          {category.link && (
            <Link
              to={category.link.replace(/https?:\/\/[^/]+/, '')}
              dangerouslySetInnerHTML={{
                __html: category.name
              }}
            />
          )}
        </span>
      ))}
    </p>
  );

  getTitle = (displayType, layout, post) => {
    const { title } = post;
    const link = this.getLink(post);
    const postType = layout === '3 Columns' ? 'small_title' : '';
    if (displayType === 'Wallpaper') {
      return (
        <p>
          <span
            className={`blog-title ${postType}`}
            dangerouslySetInnerHTML={{
              __html: title
            }}
          />
        </p>
      );
    }
    return (
      <p>
        <Link to={link}>
          <span
            className={`blog-title ${postType}`}
            dangerouslySetInnerHTML={{
              __html: title
            }}
          />
        </Link>
      </p>
    );
  };

  getExcerpt = (displayType, layout, post) => {
    const { excerpt, acf } = post;
    let subtitle = excerpt;
    let icon = '';

    if (acf && acf.venue) {
      subtitle = acf.venue;
      icon = <Material.MdLocationOn size="25" color="#4ea2ea" />;
    }

    if (subtitle) {
      if (
        displayType === 'Wallpaper' ||
        (layout !== '2 Columns' && layout !== '3 Columns')
      ) {
        return (
          <div>
            {icon}
            <span
              className="blog-content"
              dangerouslySetInnerHTML={{
                __html: subtitle
              }}
            />
          </div>
        );
      }
    }
    return '';
  };

  getContentDetails = (displayType, layout, post) => {
    const { contentDetails } = post;
    if (contentDetails) {
      if (
        displayType === 'Wallpaper' ||
        (layout !== '2 Columns' && layout !== '3 Columns')
      ) {
        return (
          <span
            className="content-details"
            dangerouslySetInnerHTML={{
              __html: ` ${this.truncate(contentDetails, 163)}`
            }}
          />
        );
      }
    }
    return '';
  };

  getContent = (displayType, layout, post) => (
    <div>
      {this.getExcerpt(displayType, layout, post)}
      {this.getContentDetails(displayType, layout, post)}
    </div>
  );

  getColumnContent = (displayType, layout, post) => {
    const { categories, acf } = post;
    const categoryList = !categories ? [] : categories;
    return (
      <div>
        {acf &&
          acf.eventDates && (
            <div className="blog-meta">{this.getDate(acf.eventDates)}</div>
          )}
        <div className="blog-excerpt">
          {this.getCategories(categoryList)}
          {this.getTitle(displayType, layout, post)}
          {this.getContent(displayType, layout, post)}
        </div>
      </div>
    );
  };

  getDate = eventDates => {
    if (eventDates) {
      return (
        <div className="blog-info">
          <Ionicons.IoCalendar size="20" color="white" />
          <span
            className="date"
            dangerouslySetInnerHTML={{
              __html: getEventDate(eventDates)
            }}
          />
        </div>
      );
    }
    return '';
  };

  getSingleColumnPost = (post, content) => {
    const isVideo = post.acf && post.acf.isVideo;

    return (
      <table className="no-spacing">
        <tbody>
          <tr>
            <td className="col-xs-7">{content}</td>
            <td
              className="col-xs-5"
              style={{ padding: '10px', paddingBottom: '30px' }}
            >
              {this.getThumbNail(
                this.getImgSrc(post, 'small'),
                isVideo,
                this.getLink(post)
              )}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  getSingleColumnWallpaper = (post, content) => (
    <table className="no-spacing">
      <tbody>
        <tr>
          <td className="col-md-12 wallpapercontainer">
            <div
              className="wallpaper"
              style={{
                backgroundImage: `url(${this.getImgSrc(post) || defaultImage})`
              }}
            >
              {(post.redirect && (
                <a
                  href={post.redirect}
                  style={{ display: 'block' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="gradient" />
                  <div className="texture" />
                  <div className="content">{content}</div>
                </a>
              )) || (
                <Link to={this.getLink(post)}>
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

  getFeaturedPost = (post, content) => {
    const isVideo = post.acf && post.acf.isVideo;

    const { isMobile } = this.state;

    return (
      <div className="featured-block">
        {this.getThumbNail(
          this.getImgSrc(post, isMobile ? 'small' : ''),
          isVideo,
          this.getLink(post)
        )}
        {content}
      </div>
    );
  };

  getFeaturedWallpaper = (post, content) => {
    const { isMobile } = this.state;

    return (
      <div className="featured-block">
        <div
          className="wallpaper"
          style={{
            backgroundImage: `url(${this.getImgSrc(
              post,
              !isMobile ? 'small' : ''
            )})`
          }}
        >
          <Link to={this.getLink(post)}>
            <div className="gradient" />
            <div className="texture" />
            <div className="content">{content}</div>
          </Link>
        </div>
      </div>
    );
  };

  getPost = (layout, post, content) => {
    const isVideo = post.acf && post.acf.isVideo;

    return (
      <div>
        <div className={`thumbnail-${layout.replace(' ', '-').toLowerCase()}`}>
          {this.getThumbNail(this.getImgSrc(post), isVideo, this.getLink(post))}
        </div>
        {content}
      </div>
    );
  };

  getWallpaper = (post, content) => (
    <div
      className="wallpaper"
      style={{ backgroundImage: `url(${this.getImgSrc(post)})` }}
    >
      <Link to={this.getLink(post)}>
        <div className="gradient" />
        <div className="texture" />
        <div className="content">{content}</div>
      </Link>
    </div>
  );

  getColumnLayout = (displayType, layout, post, numRows) => {
    const content = this.getColumnContent(displayType, layout, post);
    const { isMobile } = this.state;

    switch (layout) {
      case 'Single Column':
        switch (displayType) {
          case 'Post':
            return this.getSingleColumnPost(post, content);
          case 'Wallpaper':
            return this.getSingleColumnWallpaper(post, content);
          default:
            return this.getSingleColumnPost(post, content);
        }
      case 'Featured':
        switch (displayType) {
          case 'Post':
            return this.getFeaturedPost(post, content, isMobile);
          case 'Wallpaper':
            return this.getFeaturedWallpaper(post, content, isMobile);
          default:
            return this.getFeaturedPost(post, content, isMobile);
        }
      default:
        switch (displayType) {
          case 'Post':
            return this.getPost(`${numRows}-columns`, post, content);
          case 'Wallpaper':
            return this.getWallpaper(post, content);
          default:
            return this.getPost(`${numRows}-columns`, post, content);
        }
    }
  };

  getRowKey = currentRow =>
    currentRow.reduce((result, item) => `${item.slug} ${item.postName}`, '');

  getRows = (layout, displayType, rowOfColumns, tableStyle, resizeRows) => (
    <table className="main-table" style={tableStyle}>
      <tbody>
        {rowOfColumns.map(currentRow => (
          <tr key={this.getRowKey(currentRow)} className="main-row ">
            {currentRow.map(post => (
              <td
                key={`${post.slug} ${post.postName}`}
                className="main-col col-xs-4"
              >
                <div className="no-padding post-preview">
                  {this.getColumnLayout(
                    displayType,
                    layout,
                    post,
                    resizeRows && currentRow.length
                  )}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  getNumColumns = layout => {
    let numColumns = 1;
    switch (layout) {
      case '2 Columns':
        numColumns = 2;
        break;
      case '3 Columns':
        numColumns = 3;
        break;
      default:
        numColumns = 1;
        break;
    }

    return numColumns;
  };

  render() {
    let mainContent = '';
    let remainingPosts = '';
    let defaultLayout = 'Single Column';
    let displayType = 'Post';
    let numColumns = 1;
    const {
      numPages,
      currentPage,
      urlPrefix,
      posts,
      title,
      design,
      style,
      resizeRows
    } = this.props;
    const { isMobile } = this.state;
    if (posts.length > 0) {
      const postsClone = _.clone(posts);
      let pageDesign = { newRowLayout: [] };
      let tableStyle = {};

      if (design) {
        if (design.defaultRowLayout) defaultLayout = design.defaultRowLayout;
        if (design.defaultDisplayType) displayType = design.defaultDisplayType;
        if (design.newRowLayout && design.newRowLayout.length > 0) {
          tableStyle =
            design.newRowLayout.length > 1 && !isMobile
              ? { borderSpacing: '6px' }
              : {};
        }
        pageDesign = design;
      }
      const rowLayout =
        pageDesign.newRowLayout &&
        pageDesign.newRowLayout.map((obj, y) => ({
          id: y,
          obj
        }));
      mainContent =
        rowLayout &&
        rowLayout.map(rowInfo => {
          const layout = rowInfo.obj;
          const currentLayout = isMobile ? 'Featured' : layout.rowLayout;
          const currentDisplay = layout.displayType;
          numColumns = this.getNumColumns(currentLayout);
          const row = _.slice(postsClone, 0, numColumns);
          const rowOfColumns = _.chunk(row, numColumns);
          postsClone.splice(0, numColumns);
          return (
            <div key={rowInfo.id}>
              {this.getRows(
                currentLayout,
                currentDisplay,
                rowOfColumns,
                tableStyle,
                !!resizeRows
              )}
            </div>
          );
        });

      if (postsClone.length > 0) {
        const currentLayout = isMobile ? 'Featured' : defaultLayout;
        const currentDisplay = displayType;
        const remainingRows = _.chunk(
          postsClone,
          this.getNumColumns(currentLayout)
        ).map((obj, x) => ({
          id: x,
          obj
        }));

        tableStyle = !isMobile ? { borderSpacing: '6px' } : {};
        remainingPosts = remainingRows.map(row => (
          <div key={row.id}>
            {this.getRows(
              currentLayout,
              currentDisplay,
              [row.obj],
              tableStyle,
              !!resizeRows
            )}
          </div>
        ));
      }
      return (
        <section className="post-list-container clearfix" style={style}>
          {title ? <div className="title">{title}</div> : ''}
          {mainContent}
          {remainingPosts}
          {numPages &&
            currentPage && (
              <div className="row clearfix">
                <ul className="post-pages">
                  <li className="post-page-label">Pages</li>
                  {_.range(numPages).map(page => {
                    const displayPage = page + 1;
                    const pageUrl =
                      displayPage > 1
                        ? `${urlPrefix}page/${displayPage}`
                        : urlPrefix;
                    return (
                      <li key={page}>
                        <Link
                          to={pageUrl}
                          className={
                            currentPage === displayPage ? 'active' : ''
                          }
                        >
                          {displayPage}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
        </section>
      );
    }
    return <section />;
  }
}

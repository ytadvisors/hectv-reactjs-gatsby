import ReactGA from 'react-ga';
import { isLoggedIn, getUserId } from './session';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gtmParts from 'react-google-tag-manager';

export function startTracking() {
  let tracking_id = process.env.GA_TRACKING_ID;
  ReactGA.initialize(tracking_id);
  //Add MixPanel etc
}

export function getPage() {
  let page = localStorage.getItem('page');
  if (page) {
    return JSON.parse(page);
  }
  return {};
}

export function getCurrentPage() {
  let page = getPage();
  if (page.current) return page.current;
  return '';
}

export function trackModalView(page) {
  ReactGA.modalview('/' + page);
}

export function trackUserAction(label, action) {
  if (isLoggedIn()) {
    ReactGA.event({
      category: 'User',
      action: action,
      label: label
    });
  }
}

export function trackUser() {
  if (isLoggedIn()) {
    ReactGA.set({ userId: getUserId() });
  }
}

export class GATracker extends Component {
  constructor(props) {
    super(props);
    this.sendPageChange = this.sendPageChange.bind(this);

    // Initial page load - only fired once
    this.sendPageChange(props.location.pathname, props.location.search);
  }

  componentWillReceiveProps(nextProps) {
    // When props change, check if the URL has changed or not
    if (
      this.props.location.pathname !== nextProps.location.pathname ||
      this.props.location.search !== nextProps.location.search
    ) {
      this.sendPageChange(
        nextProps.location.pathname,
        nextProps.location.search
      );
    }
  }

  sendPageChange(pathname, search = '') {
    const page = pathname + search;
    let localPage = getPage();
    localPage.current = page;

    ReactGA.pageview(page);
    localStorage.setItem('page', JSON.stringify(localPage));
  }

  render() {
    return null;
  }
}

export class GoogleTagManager extends Component {
  componentDidMount() {
    const dataLayerName = this.props.dataLayerName || 'dataLayer';
    const scriptId = this.props.scriptId || 'react-google-tag-manager-gtm';

    if (!window[dataLayerName]) {
      const gtmScriptNode = document.getElementById(scriptId);

      eval(gtmScriptNode.textContent);
    }
  }

  render() {
    const gtm = gtmParts({
      id: this.props.gtmId,
      dataLayerName: this.props.dataLayerName || 'dataLayer',
      additionalEvents: this.props.additionalEvents || {},
      previewVariables: this.props.previewVariables || false
    });

    return (
      <div>
        <div>{gtm.noScriptAsReact()}</div>
        <div id={this.props.scriptId || 'react-google-tag-manager-gtm'}>
          {gtm.scriptAsReact()}
        </div>
      </div>
    );
  }
}

GoogleTagManager.propTypes = {
  gtmId: PropTypes.string.isRequired,
  dataLayerName: PropTypes.string,
  additionalEvents: PropTypes.object,
  previewVariables: PropTypes.string,
  scriptId: PropTypes.string
};

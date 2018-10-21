import * as types from '../types/pageTypes';

export const changePageAction = (current_page) => {
  return {
    type: types.CHANGE_PAGE,
    current_page
  };
};

export const changeOverlayStepAction = (current_step) => {
  return {
    type: types.CHANGE_OVERLAY_STEP,
    current_step
  };
};

export const loadHeaderMenuAction = (menu_slug = 'header') => {
  return {
    type: types.LOAD_HEADER_MENU,
    menu_slug
  };
};

export const loadSocialMenuAction = (menu_slug = 'social') => {
  return {
    type: types.LOAD_SOCIAL_MENU,
    menu_slug
  };
};

export const loadBottomNavMenuAction = (menu_slug = 'bottomnav') => {
  return {
    type: types.LOAD_BOTTOM_NAV_MENU,
    menu_slug
  };
};

export const loadFooterMenuAction = (menu_slug = 'footer') => {
  return {
    type: types.LOAD_FOOTER_MENU,
    menu_slug
  };
};

export const loadPageAction = (page_name) => {
  return {
    type: types.LOAD_PAGE,
    page_name
  };
};

export const loadLiveVideosAction = () => {
  return {
    type: types.LOAD_LIVE_VIDEO
  };
};

export const loadPricingPlansAction = (page = 1) => {
  return {
    type: types.LOAD_PRICING,
    page
  };
};

export const openOverlayAction = (overlay_name, overlay_settings = {}) => {
  return {
    type: types.OPEN_OVERLAY,
    overlay_name,
    overlay_settings
  };
};

export const closeOverlayAction = () => {
  return {
    type: types.CLOSE_OVERLAY
  };
};

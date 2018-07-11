import * as types from '../types/pageTypes';

export function changePageAction(current_page) {
  return {
    type: types.CHANGE_PAGE,
    current_page
  };
}

export function changeOverlayStepAction(current_step) {
  return {
    type: types.CHANGE_OVERLAY_STEP,
    current_step
  };
}

export function loadHeaderMenuAction(menu_slug = 'header') {
  return {
    type: types.LOAD_HEADER_MENU,
    menu_slug
  };
}

export function loadSocialMenuAction(menu_slug = 'social') {
  return {
    type: types.LOAD_SOCIAL_MENU,
    menu_slug
  };
}

export function loadBottomNavMenuAction(menu_slug = 'bottomnav') {
  return {
    type: types.LOAD_BOTTOM_NAV_MENU,
    menu_slug
  };
}

export function loadFooterMenuAction(menu_slug = 'footer') {
  return {
    type: types.LOAD_FOOTER_MENU,
    menu_slug
  };
}

export function loadPageAction(page_name) {
  return {
    type: types.LOAD_PAGE,
    page_name
  };
}

export function loadLiveVideosAction() {
  return {
    type: types.LOAD_LIVE_VIDEO
  };
}

export function loadPricingPlansAction(page = 1) {
  return {
    type: types.LOAD_PRICING,
    page
  };
}

export function openOverlayAction(overlay_name, overlay_settings = {}) {
  return {
    type: types.OPEN_OVERLAY,
    overlay_name,
    overlay_settings
  };
}

export function closeOverlayAction() {
  return {
    type: types.CLOSE_OVERLAY
  };
}

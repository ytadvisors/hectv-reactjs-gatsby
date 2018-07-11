import * as types from '../types/pageTypes';

const initialState = {
  current_page: 'home',
  current_tab: '',
  current_navigation_tab: '',
  current_step: 0,
  error: false,
  pricing_plans: [],
  open_overlay: '',
  overlay_settings: {},
  menus: {},
  live_video: {},
  page_title: '',
  category_title: '',
  page_data: {}
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_PAGE:
    case types.LOAD_PRICING:
    case types.LOAD_BOTTOM_NAV_MENU:
    case types.LOAD_HEADER_MENU:
    case types.LOAD_LIVE_VIDEO:
      return {
        ...state,
        error: false
      };

    //Results
    case types.SET_PAGE:
      return {
        ...state,
        error: false,
        page_data: { ...state.page_data, ...action.page_data }
      };
    case types.SET_PAGE_TITLE:
      return {
        ...state,
        page_title: action.title,
        error: false
      };
    case types.SET_CATEGORY_TITLE:
      return {
        ...state,
        category_title: action.title,
        error: false
      };
    case types.SET_PRICING:
      return {
        ...state,
        pricing_plans: action.pricing_plans
      };
    case types.SET_MENU:
      return {
        ...state,
        menus: { ...state.menus, ...action.menus }
      };
    case types.SET_LIVE_VIDEO:
      return {
        ...state,
        live_video: action.live_video
      };

    //Non Async Requests

    case types.CHANGE_PAGE:
      return {
        ...state,
        current_page: action.current_page
      };

    case types.CHANGE_NAVIGATION_TAB:
      return {
        ...state,
        current_navigation_tab: action.current_navigation_tab
      };

    case types.CHANGE_TAB:
      return {
        ...state,
        current_tab: action.current_tab
      };

    case types.CHANGE_OVERLAY_STEP:
      return {
        ...state,
        current_step: action.current_step
      };
    case types.OPEN_OVERLAY:
      delete state.overlay_settings;
      return {
        ...state,
        open_overlay: action.overlay_name,
        overlay_settings: action.overlay_settings
      };
    case types.CLOSE_OVERLAY:
      return {
        ...state,
        open_overlay: ''
      };

    //Error
    case types.CHANGE_PAGE_ERROR:
      return {
        ...state,
        error: true
      };
    default:
      return state;
  }
}

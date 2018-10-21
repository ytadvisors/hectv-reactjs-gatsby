import * as types from '../types/magazineTypes';

export const loadMagazineAction = (magazine_id) => {
  return {
    type: types.LOAD_MAGAZINE,
    magazine_id
  };
}

export const loadMagazineListAction = () => {
  return {
    type: types.LOAD_MAGAZINE_LIST
  };
};

export const loadAllMagazinesAction = (
  magazine_types = [],
  page,
  load_more = false
) => {
  return {
    type: types.LOAD_ALL_MAGAZINES,
    magazine_types,
    page,
    load_more
  };
};

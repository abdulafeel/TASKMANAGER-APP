

import { SET_THEME_MODE } from '../actions/themeActions';

const initialState = {
  themeMode: 'light', 
};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_THEME_MODE:
      return {
        ...state,
        themeMode: action.payload,
      };
    default:
      return state;
  }
};

export default themeReducer;

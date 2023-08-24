

export const SET_THEME_MODE = 'SET_THEME_MODE';

export const setThemeMode = (themeMode) => {
  return {
    type: SET_THEME_MODE,
    payload: themeMode,
  };
};

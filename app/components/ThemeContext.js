import React from 'react';
import themes from '$config/themeConfig';

const { Provider, Consumer } = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});

export {
  Provider as ThemeProvider,
  Consumer,
};

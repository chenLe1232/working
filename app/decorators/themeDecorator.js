/**
 * @PropsCompo装饰组件
 * 可以获取this.props.theme/toggleTheme
 */
import React from 'react';
import { Consumer } from '$components/ThemeContext';

export default (PropsCompo) => class extends React.Component {
  render() {
    return (
      <Consumer>
        {
          ({ theme, toggleTheme }) => <PropsCompo toggleTheme={toggleTheme} theme={theme} {...this.props} />
        }
      </Consumer>
    );
  }
};

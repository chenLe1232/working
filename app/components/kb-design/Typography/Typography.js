import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Typography extends Component {
  render() {
    const {
      children,
      style,
      range,
      blod,
      className: propsClass,
      ...props
    } = this.props;
    const className = classNames(
      'kb-typography',
      {
        'typography-rise': range === 'up',
        'typography-down': range === 'down',
        blod: blod,
      },
      propsClass
    );
    return (
      <span className={className} style={style} {...props}>
        {children}
      </span>
    )
  }
}


Typography.defaultProps = {
  size: 'normal',
};

export default Typography

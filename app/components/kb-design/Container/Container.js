import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Container extends Component {
  render() {
    const {
      children,
      flex,
      style,
      stretch,
      fullwidth,
      wrap,
      direction,
      alignItems,
      alignContent,
      justify,
      onClick,
      className: propsClass,
      ...props
    } = this.props;
    const className = classNames(
      'kb-container',
      {
        'kb-flex': flex,
        stretch: stretch,
        fullwidth: fullwidth,
        [`direction-${String(direction)}`]: direction,
        [`align-items-${String(alignItems)}`]: alignItems,
        [`align-content-${String(alignContent)}`]: alignContent,
        [`justify-${String(justify)}`]: justify,
        [`wrap-${String(wrap)}`]: wrap,
      },
      propsClass
    );
    return (
      <div className={className} style={style} onClick={onClick} {...props}>
        {children}
      </div>
    );
  }
}

Container.propTypes = {
  className: PropTypes.string, // 类名
  flex: PropTypes.bool, // 是否为flex布局
  stretch: PropTypes.bool,
  fullwidth: PropTypes.bool, // width为100%
  direction: PropTypes.oneOf(['row', 'row-reverse', 'column', 'column-reverse', 'initial']), // 对齐方式
  alignItems: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'stretch', 'baseline']), // 垂直子项对齐方式
  alignContent: PropTypes.oneOf(['stretch', 'center', 'flex-start', 'flex-end', 'space-between', 'space-around']), // 垂直内容对齐方式
  justify: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly']), // 水平对齐方式
  wrap: PropTypes.oneOf(['nowrap', 'wrap', 'wrap-reverse']), // 换行方式
};

Container.defaultProps = {
  alignContent: 'stretch',
  alignItems: 'stretch',
  direction: 'row',
  justify: 'flex-start',
};

export default Container;

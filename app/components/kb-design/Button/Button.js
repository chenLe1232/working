/* eslint-disable react/jsx-props-no-spreading */
// 执行测试的时候记得注释掉button.less jest 会默认@为装饰器的效果
import './button.less';
import React from 'react';
import classNames from 'classnames';

const Button = (props) => {
  const {
    btnType,
    className,
    disabled,
    size,
    children,
    href,
    ...restProps
  } = props;
  const classes = classNames('btn', className, {
    [`btn-${size}`]: size,
    [`btn-${btnType}`]: btnType,
  });
  if (btnType === 'link' && href) {
    return (
      <a
        className={classes}
        href={href}
        {...restProps}
      >
        {children}
      </a>
    );
  } else {
    return (
      // eslint-disable-next-line react/button-has-type
      <button
        className={classes}
        disabled={disabled}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restProps}
      >
        {children}
      </button>
    );
  }
};

Button.defaultProps = {
  disabled: false,
  btnType: 'primary',
  children: '登入',
};

export default Button;

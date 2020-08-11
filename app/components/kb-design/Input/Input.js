/* eslint-disable react/jsx-props-no-spreading */
import './input.less';
import React, { useState } from 'react';
import classNames from 'classnames';


const Input = (props) => {
  const {
    className,
    style,
    size,
    prefix,
    suffix,
    disabled,
    name,
    type="text",
    // onChange,
    ...restProps
  } = props;
  const classes = classNames('kb-input-wrapper', className, {
    [`input-size-${size}`]: size,
    'is-disabled': disabled,
    'input-group': prefix || suffix,
    'input-group-prefix': !!prefix,
    'input-group-suffix': !!suffix,
  });
 

  return (
    <div
      className={classes}
      style={style}
      tabIndex="-1"
    >
      { prefix && <span className="kb-input-group-prefix">{prefix}</span>}
      <input
        className="kb-input-inner"
        disabled={disabled}
        name={name}
        type={type}
        {...restProps}
      />
      {suffix && <span className="kb-input-group-suffix">{suffix}</span>}
    </div>
  );
};

export default Input;

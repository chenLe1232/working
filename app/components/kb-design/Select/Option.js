/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import classNames from 'classnames';
import { SelectContext } from './Select';

const Option = (props) => {
  const {
    className,
    style,
    disabled,
    index,
    value,
    ...restProps
  } = props;
  const optionContext = useContext(SelectContext);
  const classess = classNames('kb-option-item', className, {
    'is-disabled': disabled,
    'is-active': optionContext.index === index,
  });
  const handleClick = () => {
    if (optionContext.onSelect && !disabled) {
      optionContext.onSelect(index);
    }
  };
  return (
    <li
      className={classess}
      style={style}
      onClick={handleClick}
      {...restProps}
    >
      {props.value}
    </li>
  );
};

export default Option;

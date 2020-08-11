import React from 'react';
import classNames from 'classnames';

const Checkbox = (props) => {
  const {
    className,
    style,
    onClick,
    options,
    prefix,
    suffix,
    children,
    ...restProps
  } = props;
  const classess = classNames('checkbox', className);
  return (
    <div className={classess}>
      <label className="input-label">
        <span className="label-prefix">{prefix}</span>
        <input type="checkbox" onClick={onClick} className="checkbox" />
        <span className="label-suffix">{children}</span>
        <div className="checkbox-placeholder">{}</div>
      </label>
    </div>
  );
};

export default Checkbox;

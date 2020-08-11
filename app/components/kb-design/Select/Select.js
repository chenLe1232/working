import './select.less';
import React, { useState, createContext } from 'react';
import classNames from 'classnames';
import { Arrow } from '../../icons';
import debounce from 'lodash/debounce';

export const SelectContext = createContext({ currentIndex: '0' });

const Select = (props) => {
  const {
    className,
    style,
    defaultIndex,
    children,
    onSelect,
    ...restProps
  } = props;

  const [currentIndex, setActive] = useState(defaultIndex);
  const [menuOpen, setOpen] = useState(false);
  const classes = classNames('kb-select', className);
  const optionOpen = classNames('kb-options', { 'menu-open': menuOpen });
  const handleClick = (index) => {
    setActive(index);
    if (onSelect) {
      onSelect(index);
    }
  };
  let timer;
  const handleMouse = (e, toggle) => {
    clearTimeout(timer);
    e.preventDefault();
    timer = setTimeout(() => {
      setOpen(toggle);
    }, 300)
  };
  const mouseEvents = {
    onMouseEnter: (e) => { handleMouse(e, true); },
    onMouseLeave: (e) => { handleMouse(e, false); },
  };
  const passContext = {
    index: currentIndex,
    onSelect: handleClick,
  };

  const renderChildren = () => {
    return React.Children.map(children, (child, i) => {
      return React.cloneElement(child, { index: i.toString() });
    });
  };
  return (
    <div
      className={classes}
      style={style}
      {...restProps}
    >
      <div className="select-title">
        <span className="title-text">
          {children.map((item,i) => {
            if(i === Number(currentIndex)){
              return item.props.value
            }
          })}
        </span>
        <span className="select-icon" {...mouseEvents}>
          <Arrow />
          <ul className={optionOpen}>
            <SelectContext.Provider value={passContext}>
              {renderChildren()}
            </SelectContext.Provider>
          </ul>
        </span>
      </div>
    </div>
  );
};

export default Select;

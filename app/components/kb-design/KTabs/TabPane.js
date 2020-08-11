import React, { useContext } from 'react';
import classNames from 'classnames';
import { TabsContext } from './Tabs';


const TabPane = (props) => {
  const {
    index,
    disabled,
    className,
    style,
    tab,
    test,
  } = props;
  const context = useContext(TabsContext);
  const classes = classNames('tabs-pane', className, {
    'is-disabled': disabled,
    'is-active': context.index === index,
  });
  const handleClick = () => {
    if (context.onSelect && !disabled) {
      context.onSelect(index);
    }
  };
  return (
    <li className={classes} style={style} onClick={handleClick}>
      {tab}
    </li>
  );
};

TabPane.displayName = 'TabPane';
export default TabPane;

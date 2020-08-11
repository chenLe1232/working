import React, { useContext, useState, Fragment } from 'react';
import classNames from 'classnames';
import { TabsContext } from './Tabs';
import { Arrow } from '../../icons';
// import debounce from 'lodash';
// import useDebounce from '../until/useDebounce';

const TabPaneSub = (props) => {
  const {
    index,
    className,
    children,
    keys,
  } = props;
  const context = useContext(TabsContext);
  const contextIndex = context.index;
  const [tabpanesubOpen, setOpen] = useState(false);
  const classes = classNames('tabpane-sub', className, {
    'is-open': tabpanesubOpen,
  });
  const titleActive = classNames({
    'is-active': contextIndex < index ? false : true,
  });
  let timer;
  const handleMouse = (e, toggle) => {
    clearTimeout(timer);
    e.preventDefault();
    timer = setTimeout(() => {
      setOpen(toggle);
    }, 300);
    // useDebounce(function(){
    //   console.log(toggle,'toggle')
    //   setOpen(toggle);
    // }, 300)
  };
  const mouseEvents = {
    onMouseEnter: (e) => { handleMouse(e, true); },
    onMouseLeave: (e) => { handleMouse(e, false); },
  };
  const handleClick = (e) => {
    e.preventDefault();
    if (context.onSelect) {
      context.onSelect(index);
    }
  };
  const renderChildren = () => {
    const tabPaneSub = classNames('kb-tabpanesub', {
      'tabpane-open': tabpanesubOpen,
    });
    const childComponet = React.Children.map(children, (child, i) => {
      return React.cloneElement(child, {
        index: `${Number(index) + i}`,
      });
    });
    return (
      <ul className={tabPaneSub}>
        {childComponet}
      </ul>
    );
  };
  const renderTitle = () => {
    return React.Children.map(children,(child, i) => {
      const activeChildrenTab = child.props.tab;
      if ( (contextIndex >= keys && contextIndex - index === i)){
        // console.log( contextIndex, keys, i)
        return (
          <Fragment>
            {activeChildrenTab}
          </Fragment>
        )
      } else if ( contextIndex < keys && i === 0){
        return (
          <Fragment>
            {activeChildrenTab}
          </Fragment>
        )
      }
    })
  };
  return (
    <li key={index} className={classes}>
      <div className="tabpane-title" onClick={handleClick}>
        <span className={titleActive}>
          {renderTitle()}
        </span>
      </div>
      <span className="tabpane-icon" {...mouseEvents}>
        <Arrow />
        {renderChildren()}
      </span>
    </li>
  );
};

TabPaneSub.displayName = 'TabPaneSub';
export default TabPaneSub;

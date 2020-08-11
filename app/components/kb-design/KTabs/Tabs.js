import './Tabs.less';
import React, { useState, createContext, Fragment, useEffect, useMemo } from 'react';
import classNames from 'classnames';

export const TabsContext = createContext({ index: '0' });
const Tabs = (props) => {
  const {
    className,
    style,
    defaultIndex,
    children,
    onSelect,
    ...restProps
  } = props;

  const classes = classNames('kb-tabs', className);
  const [currentActive, setActive] = useState(defaultIndex);
  const handleClick = (index) => {
    setActive(index);
    if (onSelect) {
      onSelect(index);
    }
  };
  const passContext = {
    index: currentActive || '0',
    onSelect: handleClick,
  };
  const renderTitle = () => {
    return React.Children.map(children, (child, index) =>{
      const { displayName } = child.type;
      if(displayName === 'TabPane' || displayName === 'TabPaneSub'){
        return React.cloneElement(child, { index: index.toString() })
      } else {
        console.error('Warning: KTabs has a child which is not a TabPane or TabPaneSub component');
      }
    });
  };
  const renderContent = () => {
    return React.Children.map(children, (child, i) => {
      const propsChild = child.props.children;
      const { displayName } = child.type;
      const { keys } = child.props;
      if (displayName === 'TabPaneSub' && Number(keys) === i && currentActive >= keys){
        let tabsPaneSubContentChildren; 
        propsChild.map((item, childIndex) => {
          if( currentActive - keys === childIndex){
            tabsPaneSubContentChildren = item.props.children
          }
        })
        return (<div className="tabs-detail" >{tabsPaneSubContentChildren}</div>);
      }
      if (currentActive == i && displayName === 'TabPane'){
        return (<div className="tabs-detail">{propsChild}</div>);
      }
    });
  };
  return (
    <>
      <div className={classes} style={style} {...restProps}>
        <TabsContext.Provider value={passContext}>
          <ul className="tabs-item">
            {renderTitle()}
            {}
          </ul>
        </TabsContext.Provider>
      </div>
      {renderContent()}
    </>
  );
};

Tabs.defaultProps = {
  defaultIndex: '0',
};

export default Tabs;
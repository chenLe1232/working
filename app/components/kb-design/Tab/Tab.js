import React, { Component } from 'react';
import classname from 'classnames';

class TabPane extends Component {
  static defaultProps = {
    children: '',
  }

  render() {
    return (
      <div>{this.props.children}</div>
    );
  }
}

class Tab extends Component {
  static defaultProps = {
    className: '',
    children: [],
    onClick: () => { },
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      activeKey: props.activeKey,
    };
  }

  render() {
    const { theme } = this.props;
    return (
      <div className={theme.name === 'light' ? 'tab-container' : 'darktab-container'}>
        <div className={classname('title-container', this.props.className)}>
          {
            React.Children.map(this.props.children, (element, index) => {
              const activeStyle = element.key === this.state.activeKey ? 'active-title' : null;
              return (
                <span
                  onClick={() => {
                    this.setState({
                      activeKey: element.key,
                    });
                    element.props.onClick();
                  }}
                  className={classname('title-content', activeStyle)}
                  key={element.key}
                >
                  {element.props.title}
                </span>
              );
            })
          }
        </div>
        {
          React.Children.map(this.props.children, (element, index) => {
            if (element.key === this.state.activeKey) {
              return (<div className={classname('content-container', element.props.classNamePane)}>{element.props.children}</div>);
            }
          })
        }
      </div>
    );
  }
}
export default Tab;

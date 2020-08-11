import '../styles/publicComponents/tabnav.css';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

export default class TabNav extends Component {
  static Panel = class Panel extends Component {
    static defaultProps = {
      title: '',
      tip: '',
      href: null,
      handleClick: () => { },
      contentheight: 'auto',
      flex: '',
    }

    render() {
      return (
        <div className={cx('widget-content', this.props.flex)}>
          {this.props.children}
        </div>
      );
    }
  }

  static defaultProps = {
    className: '',
    active: 0,
    children: [],
    rights: [],
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      active: props.active,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      active: nextProps.active,
    });
  }

  setActive(index) {
    const len = this.props.children.length - 1;
    this.setState({
      active: index < 0 ? 0 : index > len ? len : index,
    });

    if (this.props.setActive) {
      this.props.setActive(index);
    }
  }

  render() {
    const children = React.Children.toArray(this.props.children);
    return (
      <div className={cx('widget-tab', this.props.flex)}>
        <nav className={cx('widget-header', this.props.className)}>
          {
            children.map((panel, index) => {
              const ref = `tab-menu-${index}`;
              return panel.props.href ? (
                <Link
                  ref={ref}
                  key={panel.key}
                  to={panel.props.href}
                  onClick={(e) => { this.setActive(index); panel.props.handleClick(); }}
                  className={cx({
                    'widget-tab-item': true,
                    active: this.state.active === index,
                  })}
                >
                  {panel.props.title}
                  {
                    panel.props.tip ? (
                      <span className="iconfont tip-icon" dangerouslySetInnerHTML={{ __html: '&#xe7d6;' }} data-tip={panel.props.tip} />
                    ) : null
                  }
                </Link>
              ) : (
                  <a
                    ref={ref}
                    key={panel.key}
                    href="javascript:;"
                    onClick={(e) => { this.setActive(index); panel.props.handleClick(); }}
                    className={cx({
                      'widget-tab-item': true,
                      active: this.state.active === index,
                    })}
                  >
                    {panel.props.title}
                    {
                      panel.props.tip ? (
                        <span className="iconfont tip-icon" dangerouslySetInnerHTML={{ __html: '&#xe7d6;' }} data-tip={panel.props.tip} />
                      ) : null
                    }
                  </a>
                );
            })
          }
          <div className="pull-right">
            {
              this.props.rights.map((c, i) => {
                return (
                  <div key={i} className="widget-tab-item">{c}</div>
                );
              })
            }
          </div>
        </nav>
        {
          children[this.state.active] && children[this.state.active].props.href ? null : (
            children[this.state.active]
          )
        }
      </div>
    );
  }
}

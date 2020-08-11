import React, { Component } from 'react';
import classnames from 'classnames';

class Link extends Component {
  render() {
    const {
      href,
      className: classNameProps,
      target: targetProps,
      children,
      ...props
    } = this.props;
    return (
      <a
        href={href}
        className={classnames('link-default', classNameProps)}
        target={targetProps}
        reference="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }
}
Link.defaultProps = {
  href: '#',
  target: '_blank',
};
export default Link;

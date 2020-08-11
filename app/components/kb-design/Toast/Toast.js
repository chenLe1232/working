import React, { Component } from 'react';
import ReactDom from 'react-dom';
import classnames from 'classnames';
import _ from 'lodash';

const Text = (props) => {
  return (
    <div>{ props.content }</div>
  );
};
class Toast extends Component {
  renderText = (props) => <Text {...props} />

  render() {
  	const { content, type } = this.props;
  	return (
    <div className={classnames('toast', 'toast-default', `toast-${type}`)}>
        { this.renderText({ content }) }
      </div>
  	);
  }
}

function toastAction(props) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  ReactDom.render(<Toast {...props} />, div);
  setTimeout(() => {
    document.body.removeChild(div);
  }, 3000);
}

export default _.debounce(toastAction, 300);

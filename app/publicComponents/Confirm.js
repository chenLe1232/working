import React from 'react';
import $ from 'jquery';
import Modal from './Modal';

class ConfirmView extends Modal {
  constructor(props) {
    super(props);
    this.confirmTrueAction = this.confirmTrueAction.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    this.dtd = $.Deferred();
    const $dialog = this.$dialog = $(this.refs.dialog);
    const $window = $(window);
    $dialog.css({
      width: this.props.width,
      height: this.props.height,
      top: ($window.height() - this.props.height) / 2,
      left: ($window.width() - this.props.width) / 2,
    });
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.dtd.reject();
  }

  confirmTrueAction() {
    this.dtd.resolve();
    this.close();
  }

  renderBody() {
    return (
      <div>
        <div className="dialog-text" style={{ padding: '75px 0px 44px 0px', textAlign: 'center' }}>
          <h4 className="confirm-content">{this.props.contents}</h4>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-cancel"
            onClick={() => this.close()}
            type="button"
          >
            {__('取消')}
          </button>
          <button
            className="btn btn-confirm"
            onClick={this.confirmTrueAction}
            type="button"
          >
            {__('确认')}
          </button>
        </div>
      </div>
    );
  }
}

export default function Confirm({ contents, title, width, height }) {
  const confirmEl = ConfirmView.mount({
    contents: contents,
    title: title,
    width: width,
    height: height,
  });
  return confirmEl.dtd;
}

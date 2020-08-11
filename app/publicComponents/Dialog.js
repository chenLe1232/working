import React, { Component } from 'react';
import cx from 'classnames';
import $ from 'jquery';
import Modal from './Modal';

export default class Dialog extends Modal {
  constructor(props, context) {
    super(props, context);
    this.position();
  }

  position() {
    const winWidth = $(window).width();
    const winHeight = $(window).height();
    const boxWidth = this.props.width || 1000;
    const boxHeight = this.props.height || 600;
    const top = this.props.top || (winHeight - boxHeight) / 2;
    const left = (winWidth - boxWidth) / 2;
    this.state.dialog = {
      top: top < 0 ? 20 : top,
      left: left,
      width: boxWidth,
      height: boxHeight,
    };
  }

  rendedrFooter() {
    return (
      <div />
    );
  }

  render() {
    const { dialog } = this.state;
    return (
      <div className={cx({ minimized: this.state.minimized })}>
        <div className="modal-content flex-col-1 modal-shadow" ref="dialog" style={{ background: dialog.background, height: dialog.height, width: dialog.width, top: dialog.top, left: dialog.left, zIndex: this.state.zIndex + 1 }}>
          <div className="modal-header" ref="header" style={{ cursor: 'move' }}>
            {this.renderHeader()}
            {this.renderCtrls()}
          </div>
          <div className="modal-body flex-col-1" ref="body">
            {this.renderBody()}
          </div>
        </div>
        {
          // <div className="modal-minimized">
          //   <div className="minimized-container">
          //     {this.props.title}
          //     <i className="icon" onClick={() => this.maximize()}>&#xe62d;</i>
          //     <i className="icon" onClick={() => this.close()}>&#xe64a;</i>
          //   </div>
          // </div>
        }
        {
          this.props.modal ? (
            <div className="modal-backdrop" style={{ zIndex: this.state.zIndex }} />
          ) : null
        }
      </div>
    );
  }
}

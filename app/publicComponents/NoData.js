import React, { Component } from 'react';

export default class NoData extends Component {
  static defaultProps = {
    height: 100,
    content: '暂无数据',
    textAlign: 'center',
  }

  render() {
    return (
      <div style={{ height: this.props.height, color: this.props.color, lineHeight: `${this.props.height}px`, textAlign: this.props.textAlign, marginTop: 60 }}>
        {this.props.content}
      </div>
    );
  }
}

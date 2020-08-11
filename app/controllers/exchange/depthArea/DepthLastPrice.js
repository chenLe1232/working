import React, { Component } from 'react';
import Typography from '$components/kb-design/Typography';
import Container from '$components/kb-design/Container';

let oldPrice;

class DepthLastPrice extends Component {
  componentDidMount() {
    oldPrice = this.props.ticker.LastPrz;
  }
  shouldComponentUpdate(nextProps) {
    if (this.props.ticker.Volume24 !== nextProps.ticker.Volume24) {
      oldPrice = this.props.ticker.LastPrz;
      return true;
    }
    return true;
  }
  render() {
    const {
      ticker
    } = this.props;
    return (
      <Typography className="depth-last" range={oldPrice === ticker.LastPrz ? "" : oldPrice > ticker.LastPrz ? "up" : "down"}>
        {ticker.LastPrz}
      </Typography>
    )
  }
}

export default DepthLastPrice

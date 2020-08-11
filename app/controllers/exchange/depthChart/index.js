import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// 因为按比例绘画，所以宽高可以用来调整清晰度
const WIDTH = 1500;
const STYLE_HEIGHT = 640;
const SCALE = 3;
const HEIGHT = STYLE_HEIGHT * SCALE;
let dataAry = [];

class DepthChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moveX: '',
      moveY: '',
    }
    this.canvas = React.createRef();
  }

  componentDidMount() {
    const canvas = this.canvas.current;
    canvas && canvas.addEventListener("mousemove", (e) => this.onMouseMove(e.offsetX, e.offsetY))
  }

  componentWillUnmount() {
    const canvas = this.canvas.current;
    canvas.removeEventListener("mousemove", (e) => this.onMouseMove(e.offsetX, e.offsetY));
  }

  onMouseMove(offsetX, offsetY) {
    if (!dataAry.length) return;
    const canvas = this.canvas.current;
    const x = offsetX / canvas.offsetWidth * WIDTH;
    const y = offsetY / canvas.offsetHeight * HEIGHT;
    this.setState({
      moveX: x,
      moveY: y,
    })
  }

  renderTip(x, y, index) {
    const { asks, bids } = this.props;
    const depthArr = _.concat(asks, bids);
    const direction = x > WIDTH / 2 ? 'bid' : 'ask';
    const canvas = this.canvas.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    if (direction === 'bid') {
      ctx.fillRect(x, y, -WIDTH / 6, -HEIGHT / 10);
    } else {
      ctx.fillRect(x, y, WIDTH / 6, -HEIGHT / 10)
    }
    ctx.fillStyle = 'white';
    ctx.font = "40px DIN";
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    if (direction === 'bid') {
      ctx.fillText(`price: ${depthArr[index][0]}`, (x - WIDTH / 6), (y - HEIGHT / 10));
      ctx.fillText(`volumn: ${depthArr[index][1]}`, (x - WIDTH / 6), (y - HEIGHT / 10 + 50));
    } else {
      ctx.fillText(`price: ${depthArr[index][0]}`, x, (y - HEIGHT / 10));
      ctx.fillText(`volumn: ${depthArr[index][1]}`, x, (y - HEIGHT / 10 + 50));
    }
  }

  renderDepths(ctx, depths, beginX, endX, maxY, minY, lineColor, fillColor) {
    const spaceX = (endX - beginX) / (depths.length - 1);
    const spaceY = maxY - minY;
    ctx.beginPath();
    ctx.moveTo(beginX, HEIGHT);
    for (let i = 0; i < depths.length; i++) {
      const x = beginX + i * spaceX;
      const y = HEIGHT - (depths[i][1] / spaceY * HEIGHT);
      ctx.lineTo(x, y);
      dataAry.push({ x, y });
    }
    ctx.lineTo(endX, HEIGHT);
    ctx.closePath();
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = fillColor;
    ctx.stroke();
    ctx.fill();
  }

  renderDepthInfo() {
    const { moveX, moveY } = this.state;
    if (moveX && moveY && dataAry.length) {
      const index = _.sortedIndexBy(dataAry, { x: moveX, y: moveY }, obj => obj.x);
      if (index && dataAry[index].x - moveX > moveX - dataAry[index - 1].x) {
        // 拿到前一个
        this.renderTip(dataAry[index - 1].x, dataAry[index - 1].y, index - 1);
      } else {
        // 拿到当前个
        this.renderTip(dataAry[index].x, dataAry[index].y, index);
      }
    }
  }

  renderChart(canvas) {
    const {
      asks,
      bids,
    } = this.props;
    dataAry = [];
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    if (!asks.length || !bids.length) return;
    const maxVolum = _.maxBy(_.concat(asks, bids), arr => arr[1])[1];
    const minVolum = _.minBy(_.concat(asks, bids), arr => arr[1])[1];
    asks.length && this.renderDepths(ctx, asks.sort((a, b) => b[0] - a[0]), 0, (WIDTH / 2 - 2), maxVolum, minVolum, "#f00", "rgba(224, 40, 74, 0.1)");
    bids.length && this.renderDepths(ctx, bids.sort((a, b) => b[0] - a[0]), (WIDTH / 2 + 2), WIDTH, maxVolum, minVolum, "#0f0", "rgba(45, 189, 133, 0.1)");
    this.renderDepthInfo();
  }

  render() {
    const canvas = this.canvas.current;
    canvas && this.renderChart(canvas);
    return (
      <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
        <canvas ref={this.canvas} width={WIDTH} height={HEIGHT} style={{ height: STYLE_HEIGHT }}>
        </canvas>
      </div>
    )
  }
}

const mapState = (state) => ({
  // tickers: state.ticker.tickers,
  asks: state.depth.asks,
  bids: state.depth.bids,
})

const mapDispatch = (dispatch) => ({
  handleCurrentSymbol: dispatch.ticker.handleCurrentSymbol
})

export default connect(mapState, mapDispatch)(DepthChart);

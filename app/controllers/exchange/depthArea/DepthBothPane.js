import React from 'react';
import Container from '$components/kb-design/Container';
import DepthLastPrice from './DepthLastPrice';
import DepthTable from './DepthTable';

const DepthBothPane = (props) => {
  const {
    asks,
    bids,
    ticker,
    title,
    handleSelectPrice,
  } = props;
  return (
    <Container flex stretch direction="column" className="depth-both-panel">
      {asks &&
        <DepthTable showCols={false} title={title} 
        handleSelectPrice={handleSelectPrice} 
        depth={asks.slice(0).sort((a, b) => { return b[0] - a[0] })} range="up" />}
      <DepthLastPrice ticker={ticker} />
      {bids &&
        <DepthTable showCols={false} title={title} 
        handleSelectPrice={handleSelectPrice}
        depth={bids.slice(0).sort((a, b) => { return b[0] - a[0] })} range="down" />}
    </Container>
  )
}

export default DepthBothPane;

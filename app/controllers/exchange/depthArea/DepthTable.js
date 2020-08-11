import React from 'react';
import Container from '$components/kb-design/Container';
import Typography from '$components/kb-design/Typography';
import Table from '$publicComponents/Table';

const renderDepthItem = (depth, range) => (
  [
    <Typography range={range}>
      {depth[0]}
    </Typography>,
    <Typography>
      {depth[1]}
    </Typography>
  ]
)

const DepthTable = (props) => (
  <>
    <Table showCols={props.showCols} columns={props.title} 
    data={props.depth.map(depth => renderDepthItem(depth, props.range))}
    rowClick={(depth) => props.handleSelectPrice(depth)} />
  </>
)

export default DepthTable;

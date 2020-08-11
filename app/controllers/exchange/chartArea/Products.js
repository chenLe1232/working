import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from '$publicComponents/Table';
import Container from '$components/kb-design/Container';
import Typography from '$components/kb-design/Typography';
const renderProductItem = (product) => [
  <Typography>
    {product.Sym}
  </Typography>,
  <Typography>
    {product.LastPrz}
  </Typography>,
  <Typography>
    {`${product.Prz24 ? Number((product.LastPrz - product.Prz24) / product.Prz24 * 100).toFixed(2) : 0}%`}
  </Typography>
]
const Products = (props) => (
  <Table className="product-table" columns={props.title} data={props.products.map(product => renderProductItem(product))} rowClick={(product) => props.handleProduct(product)} />
)

export default Products

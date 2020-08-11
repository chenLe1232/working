
// 用不上 后续可以删掉
const findCurrentAssetd = (products, currentSymbol) => {
  const product = products.find(item => item.Sym === currentSymbol);
  return product;
}
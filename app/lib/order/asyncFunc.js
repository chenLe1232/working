const asyncFunc = {};
asyncFunc.funcOne = async (fn1, fn2) => {
  await fn1();
  fn2();
};
asyncFunc.funcTwo = async(fn1, fn2, fn3) => {
  await fn1();
  await fn2();
  fn3();
}

export default asyncFunc;
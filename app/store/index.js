import { init } from '@rematch/core';
import selectorsPlugin from '@rematch/select'
import immerPlugin from '@rematch/immer';
import createLoadingPlugin from '@rematch/loading'
import models from './models';

const store = init({
  plugins: [
    immerPlugin(),
    selectorsPlugin(),
    createLoadingPlugin(),
  ],
  models,
});

export default store;
 
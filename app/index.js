import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { marketSocket, tradeSocket } from '$services';
import Loading from '$publicComponents/Loading';
import store from './store';
import { NoticeContainer } from '$publicComponents/Notify';
import fnResize from '$utils/resizeFontSize';
import './styles/style.less';

const Application = React.lazy(() => import('./controllers/Application'));

marketSocket.init(store);
tradeSocket.tradeSocketInit(store);
fnResize();
ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/" component={Application} />
        </Switch>
      </Suspense>
    </HashRouter>
  </Provider>,
  document.getElementById('root')
);

function mountService(Component, props = {}, parent = document.body) {
  const content = document.createElement('div');
  parent.appendChild(content);
  ReactDOM.render((
    <Component {...props} />
  ), content);
  return () => {
    ReactDOM.unmountComponentAtNode(content);
    parent.removeChild(content);
  };
}

mountService(NoticeContainer);

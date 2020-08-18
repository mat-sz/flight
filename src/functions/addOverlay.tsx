import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Overlay from '../components/Overlay';

export default function addOverlay(store: any, onReset: () => void) {
  ReactDOM.render(
    <Provider store={store}>
      <Overlay onReset={onReset} />
    </Provider>,
    document.getElementById('overlay')
  );
}

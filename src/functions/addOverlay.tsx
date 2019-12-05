import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Overlay from '../components/Overlay';

export default function addOverlay(store: any) {
    ReactDOM.render(
    <Provider store={store}>
        <Overlay />
    </Provider>, document.getElementById('overlay'));
};
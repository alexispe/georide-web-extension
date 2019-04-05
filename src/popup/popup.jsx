/* global document */
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import Popup from './containers/popup/popup';

const Index = () => <Popup />;

ReactDOM.render(<Index />, document.getElementById('app'));

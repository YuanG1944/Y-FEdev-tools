import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import './index.less';

render(<Popup />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();

import React from 'react';
import { render } from 'react-dom';
import { Toaster } from 'react-hot-toast';

import Popup from './Popup';
import './index.css';

render(<Popup />, window.document.querySelector('#app-container'));
render(<Toaster />, window.document.querySelector('#toast-container'));

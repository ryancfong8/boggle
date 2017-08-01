import React from 'react';
import ReactDOM from 'react-dom';

import Game from './game';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<Game />, document.getElementById('main'));
});

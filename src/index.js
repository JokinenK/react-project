import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import UserData from './data.json';

ReactDOM.render(<App data={UserData} />, document.getElementById('root'));
registerServiceWorker();

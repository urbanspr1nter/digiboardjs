import React from 'react';
import ReactDOM from 'react-dom';
import WsWhiteboard from './components/WsWhiteboard.jsx';

const socket = require('socket.io-client')();
ReactDOM.render(<WsWhiteboard socket={socket} width={640} height={640} />, document.getElementById('board-mount'));

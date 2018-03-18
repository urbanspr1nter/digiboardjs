import React from 'react';
import ReactDOM from 'react-dom';
import WsWhiteboard from './components/WsWhiteboard.jsx';

const socket = require('socket.io-client')();

const overlay = document.getElementById('overlay');
const prompt = document.getElementById('prompt');

const toggleOverlayAndPrompt = () => {
    overlay.style.display = 'none';
    prompt.style.display = 'none';
};

const newSessionButton = document.getElementById('new-session');
newSessionButton.addEventListener('click', () => {
    ReactDOM.render(
        <WsWhiteboard socket={socket} width={640} height={640} sessionId={''} />, 
        document.getElementById('board-mount')
    );
    toggleOverlayAndPrompt();
});

const joinSessionButton = document.getElementById('join-session');
joinSessionButton.addEventListener('click', () => {
    const joinSessionId = document.getElementById('join-session-id');
    if(joinSessionId.value === '') {
        return;
    }
    ReactDOM.render(
        <WsWhiteboard socket={socket} width={640} height={640} sessionId={joinSessionId.value} />, 
        document.getElementById('board-mount')
    );
    toggleOverlayAndPrompt();
});
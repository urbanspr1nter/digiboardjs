import React from 'react';
import ReactDOM from 'react-dom';
import WsWhiteboard from './components/WsWhiteboard.jsx';
import io from 'socket.io-client';

const uuidv4 = require('uuid/v4');

const overlay = document.getElementById('overlay');
const prompt = document.getElementById('prompt');

const toggleOverlayAndPrompt = () => {
    overlay.style.display = 'none';
    prompt.style.display = 'none';
};

const socket = io();

const newSessionButton = document.getElementById('new-session');
const defaultWidth = 360;
const defaultHeight = 640;

newSessionButton.addEventListener('click', () => {
    const sessionId = uuidv4();
    socket.emit('room', JSON.stringify({sessionId: sessionId}));
    ReactDOM.render(
        <WsWhiteboard socket={socket} width={defaultWidth} height={defaultHeight} sessionId={sessionId} />, 
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
    socket.emit('room', JSON.stringify({sessionId: joinSessionId.value}));
    ReactDOM.render(
        <WsWhiteboard socket={socket} width={defaultWidth} height={defaultHeight} sessionId={joinSessionId.value} />, 
        document.getElementById('board-mount')
    );
    toggleOverlayAndPrompt();
});
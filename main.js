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
const defaultWidth = 355;
const defaultHeight = 512;

newSessionButton.addEventListener('click', () => {
    const sessionId = uuidv4().slice(-6);
    socket.emit('room', JSON.stringify({sessionId: sessionId}));
    ReactDOM.render(
        <WsWhiteboard socket={socket} width={defaultWidth} height={defaultHeight} sessionId={sessionId} />, 
        document.getElementById('board-mount')
    );
    toggleOverlayAndPrompt();
});

const joinSessionButton = document.getElementById('join-session');
const joinSessionId = document.getElementById('join-session-id');
joinSessionButton.addEventListener('click', () => {
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

let params = (new URL(document.location)).searchParams;
let sid = params.get("sid");
if(sid.length !== 0) {
    joinSessionId.value = sid;
    joinSessionButton.click();
}

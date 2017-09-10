'use strict';

var io = require('socket.io-client');

var socket = io('http://localhost:4000');

socket.on('connect', function () {
    console.log('Connected', socket.id);


});

socket.on('disconnect', function (reason) {
    console.log('Disconnected', reason);
});

socket.on('rpt-command', function (data) {
    console.log('Got rpt-command:', data);
});
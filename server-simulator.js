'use strict';

var _ = require('lodash');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(4000);

var sockets = {};

io.on('connection', function (socket) {
    console.log('Client connected', socket.id);

    sockets[socket.id] = socket;

    sendCommand('rpt stats 21301', socket.id, function(){});

    socket.on('disconnect', function (reason) {
        console.log('Client disconnected', socket.id, reason);

        delete sockets[socket.id];
    });
});


function sendCommand(command, socketId, cb) {
    sockets[socketId].emit('rpt-command', {cmd: 'rpt stats 21301'}, function (data) {
        console.log('response', data);
        if(_.isFunction(cb)) cb();
    });


}
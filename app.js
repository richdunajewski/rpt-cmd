'use strict';

var io = require('socket.io-client');
var exec = require('child_process').exec;

var socket = io('http://hamilton.richdunajewski.com:4000?node=21301');

socket.on('connect', function () {
    console.log('Connected', socket.id);
});

socket.on('disconnect', function (reason) {
    console.log('Disconnected', reason);
});

socket.on('rpt-command', function (data, cb) {
    console.log('Got rpt-command:', data);

    exec('asterisk -rx "' + data.cmd + '"', function (err, stdout, stderr) {
        if (err) console.error(err);

        if (stdout) console.log(stdout);
        if (stderr) console.log(stderr);

        cb({msg: stdout});
    });
});
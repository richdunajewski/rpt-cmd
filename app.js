'use strict';

var exec = require('child_process').exec;
var io = require('socket.io-client');
var program = require('commander');

program
    .version('1.0.0')
    .option('-H, --host <hostname>', 'Host')
    .option('-P, --port <n>', 'Port', parseInt)
    .option('-s, --ssl', 'Use HTTPS')
    .option('-n, --node <n>', 'Node number', parseInt)
    .parse(process.argv);

if (!program.node) {
    program.outputHelp();
    process.exit(1);
}

var config = {
    host: (program.host) ? program.host : 'localhost',
    port: (program.port) ? program.port : 4000,
    useHttps: (program.ssl) ? program.ssl : false,
    node: (program.node) ? program.node : null
};

var socket = io(((config.useHttps) ? 'https://' : 'http://') + config.host + ':' + config.port + '?node=' + config.node);

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

socket.on('raw-command', function (data, cb) {
    console.log('Got raw-command:', data);

    //sanity check what they're sending us to prevent attacks
    var whitelist = ['reboot'];
    if (whitelist.indexOf(cmd) === -1) {
        cb({msg: 'Raw command was not in the whitelist. Ignoring...'})
    } else {
        exec(data.cmd, function (err, stdout, stderr) {
            if (err) console.error(err);

            if (stdout) console.log(stdout);
            if (stderr) console.log(stderr);

            cb({msg: stdout});
        });
    }
});
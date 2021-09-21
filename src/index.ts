require('dotenv').config();
import fs from 'fs';
import { spawnNode } from './process-spawner';
import { networkInterfaces } from 'os';
import express, { Application } from 'express';
import { glob } from 'glob';
import path from 'path'
import API from './API';
const nrf24 = require('nrf24');
console.log(nrf24);

process.on('unhandledRejection', console.error);
process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
});

 

const app = express()
// start broadcasting ip:port of the server
spawnNode('./dist/dnssd-advertise.js');

app.get('/', function (req, res) {
    res.send('Hello World')
})

loadAPIs(app);
startServer(app);

function startServer(app: Application) {
    try {
        // get local ip
        const nets = <any>networkInterfaces();
        const results: any = {};
        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                if (net.family === 'IPv4' && !net.internal) {
                    if (!results[name]) {
                        results[name] = [];
                    }
                    results[name].push(net.address);
                }
            }
        }
        console.log(results);
        const ips = results.wlan0 ?? results.eth0 ?? results.Ethernet;
        if (ips[0] === undefined || process.env.PORT === undefined) {
            throw new Error('ERROR: Cannot start server at address ' + ips[0] + ':' + process.env.PORT);
        }
        console.log('Starting gateway server at ' + ips[0] + ':' + process.env.PORT);
        app.listen(parseInt(process.env.PORT), ips[0]);
    } catch (e) {
        console.error(e);
        setTimeout(startServer, 5000);
    }
}

function loadAPIs(app: Application): void {
    var c = require('./api/testing.api');
    glob("./**/*.api.js", (err, matches) => {
        matches.forEach(m => {
            const modulePath: string = './' + path.relative(__dirname, m);
            console.log(modulePath);
            let importedClass = require(modulePath).default;
            // check exports
            if (importedClass === undefined || !(importedClass.prototype instanceof API)) {
                throw `ERROR: the module '${modulePath}' doesn't export a class that inherits API class`;
            }
            // check inheritance
            if (importedClass?.s)
                console.log('typeof', typeof importedClass);
            if (importedClass.initialize !== undefined) {
                importedClass.initialize(app);
            }
            console.log(m);
        });
    });
}
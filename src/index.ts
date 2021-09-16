require('dotenv').config();
import fs from 'fs';
import { spawnNode } from './process-spawner';
import { networkInterfaces } from 'os';
import express, { Application } from 'express';
import { glob } from 'glob';
import path from 'path/posix';
import API from './API';
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
            let apiClass = require('./' + path.relative(__dirname, m)).default;
            // check exports
            if(apiClass === undefined){
                throw ``
            }
            // check inheritance
            if(apiClass?.s)
            console.log('typeof', typeof apiClass);
            if (apiClass.initialize !== undefined) {
                apiClass.initialize(app);
            }

            console.log(m);
        });
    });
}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const process_spawner_1 = require("./process-spawner");
const os_1 = require("os");
const express_1 = __importDefault(require("express"));
const glob_1 = require("glob");
const posix_1 = __importDefault(require("path/posix"));
const API_1 = __importDefault(require("./API"));
const app = (0, express_1.default)();
// start broadcasting ip:port of the server
(0, process_spawner_1.spawnNode)('./dist/dnssd-advertise.js');
app.get('/', function (req, res) {
    res.send('Hello World');
});
loadAPIs(app);
startServer(app);
function startServer(app) {
    var _a, _b;
    try {
        // get local ip
        const nets = (0, os_1.networkInterfaces)();
        const results = {};
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
        const ips = (_b = (_a = results.wlan0) !== null && _a !== void 0 ? _a : results.eth0) !== null && _b !== void 0 ? _b : results.Ethernet;
        if (ips[0] === undefined || process.env.PORT === undefined) {
            throw new Error('ERROR: Cannot start server at address ' + ips[0] + ':' + process.env.PORT);
        }
        console.log('Starting gateway server at ' + ips[0] + ':' + process.env.PORT);
        app.listen(parseInt(process.env.PORT), ips[0]);
    }
    catch (e) {
        console.error(e);
        setTimeout(startServer, 5000);
    }
}
function loadAPIs(app) {
    var c = require('./api/testing.api');
    console.log(c.default.prototype instanceof API_1.default);
    (0, glob_1.glob)("./**/*.api.js", (err, matches) => {
        matches.forEach(m => {
            let api = require('./' + posix_1.default.relative(__dirname, m));
            console.log('typeof', typeof api);
            if (api.initialize !== undefined) {
                api.initialize(app);
            }
            console.log(m);
        });
    });
}
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnNode = exports.spawn = void 0;
const child_process_1 = require("child_process");
var children = [];
process.on('exit', function () {
    console.log('killing', children.length, 'child processes');
    children.forEach(function (child) {
        child.kill();
    });
});
function spawn(command, args) {
    const proc = (0, child_process_1.spawn)(command, args);
    children.push(proc);
    proc.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    proc.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    proc.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}
exports.spawn = spawn;
function spawnNode(scriptPath) {
    exports.spawn('node', [scriptPath]);
}
exports.spawnNode = spawnNode;
//# sourceMappingURL=process-spawner.js.map
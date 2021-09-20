import { ChildProcessWithoutNullStreams, spawn as spawnProcess } from 'child_process';
var children: ChildProcessWithoutNullStreams[] = [];

process.on('exit', function () {
    console.log('killing', children.length, 'child processes');
    children.forEach(function (child) {
        child.kill();
    });
});
function spawn(command: string, args: string[]) {
    const proc = spawnProcess(command, args);
    console.log('spawned 1 process with pid =', proc.pid);
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

function spawnNode(scriptPath: string) {
    exports.spawn('node', [scriptPath]);
}

export { spawn, spawnNode };
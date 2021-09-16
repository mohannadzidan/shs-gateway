require('dotenv').config();
const fs = require('fs')
const path = require('path')
const { NodeSSH } = require('node-ssh')
const TscWatchClient = require('tsc-watch/client');
const ssh = new NodeSSH()
const watch = new TscWatchClient();
const glob = require("glob-promise");

watch.on('success', () => {
    // collect local files
    var localFilesIndex = {};
    var remoteFilesIndex = {};
    glob('./dist/**/*.js').then(matches => { // get local files index
        matches.forEach(e => {
            localFilesIndex[e] = fs.statSync(e).mtime.getTime() / 1000;
        })
        return ssh.execCommand("find $l -type f -print0 | xargs -0 stat --format '%.Y %n'", { cwd: "./shs-gateway/dist" });
    }).then(r => { // get remote files index
        r.stdout.split('\n').forEach(l => {
            const s = l.split(' ');
            if (s[1]) {
                remoteFilesIndex["./dist" + s[1].substr(1)] = parseFloat(s[0]) // file : modificationTimeInMilliseconds
            }
        });
        const dif = diff(localFilesIndex, remoteFilesIndex);
        console.log(dif);
        const promises = [];
        dif.deleted.forEach(e => {
            promises.push(ssh.execCommand("rm " + e, { cwd: "./shs-gateway" }));
        })
        promises.push(ssh.putFiles(dif.changed.map(e => { return { local: e, remote: './shs-gateway/' + e } })));
        return Promise.all(promises);
    }).then(() => {
        return ssh.execCommand("stat ./package.json --format '%.Y'", { cwd: "./shs-gateway" });
    }).then((r) => { // copy package.json
        var localPackageModTime = fs.statSync('./package.json').mtime.getTime() / 1000;
        var remotePackageModTime = r.stdout.length > 0 ? parseFloat(r.stdout) : 0;
        if (localPackageModTime > remotePackageModTime) {
            var localPackage = JSON.parse(fs.readFileSync('./package.json'));
            delete localPackage.devDependencies;
            fs.writeFileSync('./temp-package.json', JSON.stringify(localPackage));
            return ssh.putFile('./temp-package.json', './shs-gateway/package.json');
        }
    }).then((r) => {
        if (fs.existsSync('./temp-package.json')) {
            fs.rmSync('./temp-package.json');
            console.log("run 'npm install' on remote..");
            return ssh.execCommand('npm install', {
                cwd: './shs-gateway',
                onStdout(chunk) {
                    process.stdout.write(chunk.toString('utf8'));
                },
                onStderr(chunk) {
                    process.stderr.write(chunk.toString('utf8'));
                },
            });
        }
    });



});

console.log("ssh login pi@SHS-gateway...")
ssh.connect({
    host: 'SHS-gateway',
    username: 'pi',
    password: process.env.SSH_PASS
}).then(() => {
    watch.start('--project', '.');
});

function diff(src, dest) {
    const res = {
        changed: [],
        deleted: [],
    };
    Object.keys(src).forEach(srcFile => {
        const modificationTime = src[srcFile];
        const remoteFileModTime = dest[srcFile];
        if (remoteFileModTime === undefined || remoteFileModTime < modificationTime) {
            res.changed.push(srcFile);
        }
    });

    Object.keys(dest).forEach(destFile => {
        if (src[destFile] === undefined) {
            res.deleted.push(destFile);
        }
    });
    return res;
}
'use strict';

const Recluster = require('recluster');
const Path = require('path');
let NODE_ENV = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`NODE_ENV = ${NODE_ENV}`);

let opt = {};
if (NODE_ENV === 'development') {
  opt.workers = 1;
}

const cluster = Recluster(Path.resolve(__dirname, './app.js'), opt);
cluster.run();
process.on('SIGUSR2', function() {
    console.log('Got SIGUSR2, reloading cluster...');
    if (NODE_ENV !== 'development') {
      cluster.reload();
    }
});

console.log("spawned cluster, kill -s SIGUSR2", process.pid, "to reload");
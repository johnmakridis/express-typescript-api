import * as cluster from 'cluster';
import * as os from 'os';

const cpuCount = os.cpus().length;
const log = console.log;

if (cluster.isMaster) {
    for (let i = 0; i < cpuCount; i++)
        cluster.fork();

    cluster.on('exit', () => { cluster.fork(); });
}
else {
    require('./app');
    log(`Worker ${process.pid} started`);
}

let worker_obj,
    worker_ix = 0,
    worker_ondata,
    worker_busy,
    request_queue = [],
    worker_crashed;

function worker() {
    if (!worker_obj) {
        worker_obj = new Worker('assets/worker.js');
        worker_obj.onmessage = function (evt) {
            if (worker_busy && worker_ix === evt.data.ix) {
                worker_ondata(evt.data);
            }
            else {
                worker_crash('Invalid reply');
            }
        };
        worker_obj.onerror = function (evt) {
            worker_crash(evt);
        };
    }
    return worker_obj;
}

function worker_crash(why) {
    worker_crashed = why;
    if (worker_busy) { worker_ondata(null); }
}

function worker_unbusy() {
    worker_busy = false;
    worker_ondata = null;
    if (request_queue.length) { request_queue.shift()(); }
}

export function workerRequest(cmd, args, chatty_cb) {
    return new Promise((resolve, reject) => {
        request_queue.push(() => {
            worker_busy = true;
            if (worker_crashed) { reject(worker_crashed); return worker_unbusy(); }
            worker_ondata = data => {
                if (worker_crashed) { reject(worker_crashed); return worker_unbusy(); }
                switch (data.cmd) {
                    case 'return':
                        resolve(data.args);
                        return worker_unbusy();
                    case 'error':
                        reject(data.args);
                        return worker_unbusy();
                    default:
                        if (chatty_cb) { chatty_cb(data.cmd, data.args); }
                        break;
                }
            };
            worker().postMessage({ op: 'do', ix: ++worker_ix, cmd: cmd, args: args });
        });
        if (!worker_busy) { request_queue.shift()(); }
    });
}

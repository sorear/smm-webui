// Worker stub: Since many smm operations can go off and compute for several seconds, we want to do that off the UI thread.
// This also keeps us honest and prevents the UI from trying to do synchronous stuff with database contents, that would become problematic with lazy loading

let current_command, current_command_seq;
const handlers = new Map();
console.log('F');
class Command {
    constructor() {
        this.stop_req = false;
    }
    send(msg, args) {
        if (this !== current_command) throw new Error('tried to reply from non-current command');
        self.postMessage({ op: 'reply', ix: current_command_seq, cmd: msg, args: args});
    }
    onmessage() { }
}

self.onmessage = function (e) {
    let data = e.data;
console.log('G',data);
    switch (data.op) {
        case 'do':
            if (current_command) throw new Error('Got do, command already running');
            current_command_seq = data.ix;
            let cmd = current_command = new Command();
            new Promise(resolve => resolve((handlers.get(data.cmd) || (c => {throw new Error('unhandled command')}))(data.args, cmd))).then(
                retval => { cmd.send('return', retval); current_command = null; },
                rejval => { cmd.send('error', String(rejval)); current_command = null; }
            );
            break;
        case 'stop':
            current_command.stop_req = true;
            break;
        default:
            throw new Error('unknown optype');
    }
};

export default function register(name, fn) {
    handlers.set(name, fn);
};

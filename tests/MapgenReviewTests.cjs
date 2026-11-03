// node tests/MapgenReviewTests.cjs <checkout containing rpgcobo.exe and resources>
// Runs this checkout's actual scripts in a separate native runtime process.
const fs = require('node:fs');
const path = require('node:path');
const {spawn} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const runtime = path.resolve(process.argv[2] || root);
const source = ['MapGenerator.sk', 'MapGenDialog.sk'].map(name => {
    const file = `project/plugin/rpgtools/mapeditor/${name}`;
    return `compilestring(${JSON.stringify(fs.readFileSync(path.join(root, file), 'utf8'))},${JSON.stringify('/plugin/rpgtools/mapeditor/' + name)}).bindenv(getroottable())();`;
}).join('\n') + '\nreturn compilestring(' + JSON.stringify(fs.readFileSync(path.join(__dirname, 'MapgenReviewTests.sk'), 'utf8')) + ',"MapgenReviewTests.sk").bindenv(getroottable())();';
const child = spawn(path.join(runtime, 'rpgcobo.exe'), ['-mcp-stdio'], {
    cwd: runtime, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true,
});
let buffer = '', finished = false;
const finish = (error, result) => {
    if (finished) return;
    finished = true; clearTimeout(timer); child.kill();
    if (error) {console.error(error); process.exitCode = 1;}
    else console.log(result);
};
const timer = setTimeout(() => finish('Native mapgen regression tests timed out'), 30000);
const send = message => child.stdin.write(JSON.stringify({jsonrpc: '2.0', ...message}) + '\n');
child.on('error', error => finish(error.message));
child.on('exit', code => {if (!finished) finish(`Native runtime exited before returning tests (${code})`);});
child.stderr.on('data', data => process.stderr.write(data));
child.stdout.on('data', data => {
    buffer += data;
    let newline;
    while ((newline = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, newline); buffer = buffer.slice(newline + 1);
        let message; try {message = JSON.parse(line);} catch {continue;}
        if (message.error) {
            const error = message.error;
            finish(JSON.stringify({message:error.message,trace:error.data?.trace?.map(({func,src,line})=>({func,src,line}))})); return;
        }
        if (message.id === 1) {
            send({method: 'notifications/initialized'});
            send({id: 2, method: 'tools/call', params: {name: 'rpgcobo_runtime_execute', arguments: {script: source}}});
        }
        if (message.id === 2) {
            const result = message.result;
            if (result?.isError) finish(JSON.stringify(result));
            else {
                let report; try {report = JSON.parse(result?.content?.find(block => block.type === 'text')?.text);} catch {}
                if (!report?.passed) finish('Regression tests did not return a passing report');
                else finish(null, JSON.stringify(report));
            }
        }
    }
});
send({id: 1, method: 'initialize', params: {
    protocolVersion: '2024-11-05', capabilities: {}, clientInfo: {name: 'mapgen-review-tests', version: '1'},
}});

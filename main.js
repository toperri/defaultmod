const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 10200;

app.disable('x-powered-by');

app.use(function (req, res, next) {
    res.header('X-Application', 'DefaultMod');

    if (req.ip.includes('127.0.0.1') || req.ip.includes('::1') || req.ip.includes('localhost')) {
        next();
    }
    else
    {
        res.status(403).send('Forbidden');
    }
});
app.use('/', express.static('static'));
app.get('/getApps', (req, res) => {
    exec('defaults domains', (stdout, stderr) => {
        if (stderr) {
            res.json({output: stderr});
        } else {
            if (stdout) {
                res.json({output: stdout});
            }
        }
    });
});

app.get('/loadApp',(req,res) => {
    if (!req.query.app)
    {
        res.status(400).send('no app query field');
    }
    exec('defaults read ' + req.query.app, (stdout, stderr) => {
        if (stderr) {
            res.header('X-Error','yes');
            res.send(stderr);
        } else {
            if (stdout) {
                res.send('SERVERSIDE ERROR: could not read defaults for ' + req.query.app);
            }
        }
    });
});

var hbReceived = false;
var hbi = null
var heartbeats = 1; // give mercy
app.get('/hb/stop',(req,res) => {
    clearInterval(hbi);
    hbReceived = false;
    heartbeats = 1;
    console.log('stopped heartbeat.');
    res.send('OK');
});
app.get('/hb/ping',(req,res) => {
    heartbeats += 1;
    res.send('cc');
});
app.get('/hb/start',(req,res) => {
    if (!hbReceived)
    {
        console.log('heartbeating request received. closing endpoint.');
        hbi = setInterval(function () {
            heartbeats--;
            if (heartbeats > 5)
            {
                heartbeats = 5;
            }
            if (heartbeats < 0)
            {
                console.log('heartbeating stopped, closing app');
                process.exit(0);
            }
        },86);
        hbReceived = true;
        res.send('OK');
    }
    else
    {
        res.send('NO');
    }
});

app.get('/writeDefaults', (req, res) => {
    var { where, what, appPacket } = JSON.parse(atob(req.query.data));
    if (!where || !what)
    {
        res.status(400).send('no where or what field');
    }

        exec('defaults write ' + appPacket + ' ' + where + ' ' + what, (stdout, stderr) => {
            if (stderr == '' && stdout == null)
            {
                res.send('Default written successfully.');
            }
            else
            {
                res.send('Error while writing default: ' + stderr + ' ' + stdout);
            }
        });
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        exec('open http://localhost:' + port);
    });
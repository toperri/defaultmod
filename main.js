const express = require('express');
const { exec } = require('child_process');

const app = express();
var tookTheL = false;
const port = 10200;

app.disable('x-powered-by');

app.use(function (req, res, next) {
    if (tookTheL)
    {
        res.redirect('https://www.youtube.com/watch?v=_bckcpIUBo8');
    }
    else
    {
        next();
    }
});

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
            var array = stderr.trim().split(',');

            res.json({output: array});
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

    if (req.query.app.includes('&&') || req.query.app.includes(';') || req.query.app.includes('"'))
    {
        res.status(400).send('Security fault detected in request. Might be a hacking attempt.');
        return;
    }
    exec('defaults read "' + req.query.app + '"', (stdout, stderr) => {
        if (stderr) {
            res.header('X-Error','yes');
            res.send(stderr);
        } else {
            if (stdout) {
                res.send("Oof! The backend dudes can't get what you want. Here's what they said:\n\n\n" + stdout);
            }
        }
    });
});

app.get('/backend/close', (req, res) => {
    console.log('received!');
    res.send('ok');
});

app.get('/userisstupidandgithubcopilotsuggestedthisstringhelpme',(req,res) => {
    tookTheL = true;
    res.send('ok');
});

app.get('/deleteApp', (req, res) => {
    var app = req.query.app;

    if (req.query.app.includes('&&') || req.query.app.includes(';') || req.query.app.includes('"'))
    {
        res.status(400).send('Security fault detected in request. Might be a hacking attempt.');
        return;
    }

    exec('defaults delete ' + app, (stdout, stderr) => {
        if (stderr == '' && stdout == null)
        {
            res.send('OK');
        }
        else
        {
            res.send('ERROR//' + stderr + ' ' + stdout);
        }
    });
});
app.get('/writeDefaults', (req, res) => {
    var { where, what, appPacket } = JSON.parse(atob(req.query.data));
    if (!where || !what)
    {
        res.status(400).send('no where or what field');
    }

    if (where.includes('&&') || where.includes(';') || where.includes('"') || what.includes('&&') || what.includes(';') || what.includes('"') || appPacket.includes('&&') || appPacket.includes(';') || appPacket.includes('"'))
    {
        res.status(400).send('Security fault detected in request. Might be a hacking attempt.');
        return;
    }

        exec('defaults write ' + appPacket + ' ' + where + ' ' + what, (stdout, stderr) => {
            if (stderr == '' && stdout == null)
            {
                if (appPacket == 'com.apple.dock')
                {
                    exec('killall Dock');
                    res.send('The Dock setting was written successfully.');
                }
                else
                {
                    res.send('The app packet was written successfully.');
                }
            }
            else
            {
                res.send('Error while writing the app packet: ' + stderr + ' ' + stdout);
            }
        });
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        exec('open http://localhost:' + port);
    });
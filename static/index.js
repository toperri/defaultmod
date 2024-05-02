var selectedButton = null;
var firstCreatedButton = true;
var selectedPacket = "";

function makeButton(name) {
    document.getElementById('defaultAppList').appendChild(document.createElement('br'));
    var li = document.createElement('button');
    li.innerHTML = name;
    li.onclick = function () {
        li.style.backgroundColor = '#3733b5';
        li.style.color = 'white';
        if (selectedButton)
        {
            selectedButton.style.backgroundColor = '#dcdcdc';
            selectedButton.style.color = 'black';
            if (selectedButton == li)
            {
                selectedButton = null;
            }
        }
        selectedPacket = name;
        selectedButton = li;

        fetch('./loadApp?app=' + name).then(r => r.text()).then(function (res) {
            document.getElementById('textstuff').value = res;
        });
    }
    document.getElementById('defaultAppList').appendChild(li);
}

fetch('./getApps').then(r => r.json()).then(function (res) {
    document.getElementById('upperMT').innerHTML = "";
    var arr = res.output.trim().split(',');

    arr.forEach(function (item) {
        makeButton(item.trim());
    });
});

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey) {
        if (firstCreatedButton)
        {
            fetch('./hb/stop');
            clearInterval(hbi);
            hbi = null;
            var selectedText = document.getSelection().toString();
            if (!localStorage.getItem('alertedAboutTextbox'))
            {
                window.alert('DefaultMod does not support modifying defaults directly from the textbox yet.');
                localStorage.setItem('alertedAboutTextbox', true);
            }
            var where = window.prompt('Select the field to modify.',selectedText);
            if (!where || where.length == 0)
            {
                window.alert('Aborting.');
                return;
            }
            var what = window.prompt('Enter the value to write.');
            if (where && what)
            {
                var json = {
                    where: where,
                    what: what,
                    appPacket: selectedPacket
                };

                fetch('./writeDefaults?data=' + btoa(JSON.stringify(json))).then(r => r.text()).then(function (res) {
                    window.alert(res);
                    fetch('./hb/start');
                    hbi = setInterval(function () {
                        fetch('./hb/ping').then(r => r.text()).then(function (res) {
                            if (res == 'cc')
                            {
                                console.log('heartbeat worked.');
                            }
                        });
                    }, 80);
                });
            }
            else
            {
                window.alert('Aborting.');
                fetch('./hb/start');
                hbi = setInterval(function () {
                    fetch('./hb/ping').then(r => r.text()).then(function (res) {
                        if (res == 'cc')
                        {
                            console.log('heartbeat worked.');
                        }
                    });
                }, 80);
            }
        }
    }
});

var hbi = null;

fetch('./hb/start').then(r => r.text()).then(function (res) {
    if (res == 'OK')
    {
        console.log('started heartbeat');

        hbi = setInterval(function () {
            fetch('./hb/ping').then(r => r.text()).then(function (res) {
                if (res == 'cc')
                {
                    console.log('heartbeat worked.');
                }
            });
        }, 80);
    }
    else
    {
        if (res == 'NO')
        {
            window.location.reload();
        }
    }
});
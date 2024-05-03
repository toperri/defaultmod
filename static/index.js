if (!navigator.userAgent.includes("Chrome"))
{
    window.alert('Oof! You are not using Chrome. This website may not work as expected.');
}
var selectedButton = null;
var firstCreatedButton = true;
var selectedPacket = "";
var buttons = [];
var dockSecured = true;
var limbo = []; // bad name, but it's where the buttons go when they're hidden

if (!localStorage.getItem('dockSecured'))
{
    localStorage.setItem('dockSecured', 'true');
}

dockSecured = (localStorage.getItem('dockSecured') == 'true');

function desecureDock()
{
    dockSecured = false;
    localStorage.setItem('dockSecured', 'false');
    window.alert('The Dock security settings were disabled. Proceed with caution. We are not responsible for any damage caused by modifying the Dock.');
}

var searchBarString = "";
function makeButton(name) {
    document.getElementById('defaultAppList').appendChild(document.createElement('br'));
    var li = document.createElement('button');
    li.className = 'button';
    li.innerHTML = (name == 'com.apple.dock' && dockSecured ? name + ' (DANGER)' : name);
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
        if (selectedPacket == 'com.apple.dock' && dockSecured)
        {
            window.alert('Heads up! For security purposes, this app packet is read-only.');
        }
        selectedButton = li;

        fetch('./loadApp?app=' + name).then(r => r.text()).then(function (res) {
            document.getElementById('textstuff').value = res;
        });
    }
    buttons.push(li);
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
    if (event.ctrlKey && event.key.toLowerCase() === 'm') {
        modify();
    }
    if (event.ctrlKey && event.key.toLowerCase() === 's') {
        search();
    }
});

function modify() {
    if (firstCreatedButton) {
        if (selectedPacket == "com.apple.dock" && dockSecured) {
            window.alert('Heads up! For security purposes, this app packet is read-only.');
            return;
        }
        var selectedText = document.getSelection().toString();
        if (!localStorage.getItem('alertedAboutTextbox')) {
            window.alert('DefaultMod does not support modifying defaults directly from the textbox yet.');
            localStorage.setItem('alertedAboutTextbox', true);
        }
        var where = window.prompt('Select the field to modify.', selectedText);
        if (!where || where.length == 0) {
            window.alert('Aborting.');
            return;
        }
        var what = window.prompt('Enter the value to write.');
        if (where && what) {
            var json = {
                where: where,
                what: what,
                appPacket: selectedPacket
            };
            fetch('./writeDefaults?data=' + btoa(JSON.stringify(json))).then(r => r.text()).then(function (res) {
                window.alert(res);
            });
        } else {
            window.alert('Aborting.');
        }
    }
}

function addDefault()
{
    var name = window.prompt('Insert the app packet name. (e.g. com.apple.dock). Make sure you know what you are doing with the name.','com.example.app');
    if (name)
    {
        var json = {
            where: 'example',
            what: '1',
            appPacket: name
        };
        fetch('./writeDefaults?data=' + btoa(JSON.stringify(json))).then(r => r.text()).then(function (res) {
            if (res == 'Default written successfully.')
            {
                window.alert('The app packet was added successfully.');
                window.location.reload();
            }
        });
    }
}

function removeDefault()
{
    if (!selectedPacket)
    {
        window.alert('No app packet selected.');
        return;
    }

    if (selectedPacket.startsWith('com.apple') && selectedPacket != 'com.apple.dock')
    {
        window.alert('Heads up! Removing an Apple app packet may cause unexpected behavior.')
    }

    if (!window.confirm((selectedPacket != 'com.apple.dock' ? 'Are you sure you want to remove the app packet ' + selectedPacket + '?' : 'Are you sure you want to remove Dock settings?')))
    {
        return;
    }

    fetch('./deleteApp?app=' + selectedPacket).then(r => r.text()).then(function (res) {
        if (res == 'OK')
        {
            window.alert('The app packet was removed successfully.');
            window.location.reload();
        }
        else
        {
            window.alert('The app packet could not be removed.');
        }
    });
}
let accountList = [];

fetch('/assets/line_accounts.json').then(value => {
    return value.json();
}).then(json => {
    accountList = json;
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (sender.id !== chrome.runtime.id) {
        return false;
    }

    const msg = request.message;
    switch (msg) {
        case 'getAccountList':
            sendResponse(accountList);
            return true;
        case 'setCert':
            setCert(request.cert);
            sendResponse();
            return true;
    }

    sendResponse();
    return true;
});

function setCert(cert) {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;

        const obj = {
            url: url,
            name: 'cert',
            value: cert,
            path: '/',
            domain: '.access.line.me',
            secure: true,
            httpOnly: true,
        };
        chrome.cookies.set(obj);
    });

}
const form = document.querySelector('form[action="/oauth2/v2.1/authenticate"]');
let selectList;
let accountList;
init();

function init() {
    const legend = form.querySelectorAll('legend');
    if (legend.length <= 0) {
        return
    }
    createButton(form);
}

/**
 *
 * @param form {Element}
 */
function createButton(form) {
    const button = document.createElement('div');
    button.classList.add('line-cert-action-button');
    button.innerText = 'アカウントを選択';
    form.appendChild(button);

    button.addEventListener('click', () => {
        chrome.runtime.sendMessage({'message': 'getAccountList'}, (list) => {
            accountList = list;
            showAccountList(list);
        });
    });
}

function showAccountList(accountList) {
    const owner = document.createElement('div');

    const back = document.createElement('div');
    back.classList.add('line-cert-account-list-back');

    const parent = document.createElement('div');
    parent.classList.add('line-cert-account-list');

    const row = document.createElement('div');
    row.classList.add('row');
    row.classList.add('title-row');
    const id = document.createElement('div');
    id.classList.add('id');
    id.innerText = 'ID';
    const email = document.createElement('div');
    email.classList.add('email');
    email.innerText = 'メールアドレス';
    const select = document.createElement('div');
    select.classList.add('select');
    select.innerText = '操作';
    row.appendChild(id);
    row.appendChild(email);
    row.appendChild(select);
    parent.appendChild(row);

    // 検索行
    const searchRow = document.createElement('div');
    searchRow.classList.add('row');
    searchRow.classList.add('search-row');

    const searchInput = document.createElement('input');
    searchInput.classList.add('search-input');
    searchInput.setAttribute('placeholder', '検索条件を入力(IDとメールアドレスで検索可能)');

    const searchSubmit = document.createElement('div');
    searchSubmit.classList.add('search-submit');

    searchRow.appendChild(searchInput);
    searchRow.appendChild(searchSubmit);
    parent.appendChild(searchRow);

    const accountRows = document.createElement('div');
    accountRows.classList.add('account-rows');
    createRowsAndAppend(accountList, accountRows);
    parent.appendChild(accountRows);

    selectList = owner;
    owner.appendChild(parent);
    owner.appendChild(back);
    document.body.appendChild(owner);

    back.addEventListener('click', () => {
        document.body.removeChild(selectList);
    }, false);

    searchInput.addEventListener('change', () => {
        const value = searchInput.value;
        accountRows.innerHTML = '';
        if (value === '') {
            createRowsAndAppend(accountList, accountRows);
            return;
        }
        const showList = accountList.filter((account) => {
            const inputNumber = Number(value);
            if (account.id === inputNumber) {
                return true;
            }
            if (isNaN(inputNumber)) {
                return account.email.includes(value);
            } else {
                return false;
            }
        });
        createRowsAndAppend(showList, accountRows);
    });
}

/**
 * @param accountList {Array}
 * @param accountRows {Element}
 */
function createRowsAndAppend(accountList, accountRows) {
    for (let account of accountList) {
        const row = document.createElement('div');
        row.classList.add('row');

        const id = document.createElement('div');
        id.classList.add('id');
        id.innerText = account.id;

        const email = document.createElement('div');
        email.classList.add('email');
        email.innerText = account.email;

        const select = document.createElement('div');
        select.classList.add('select');
        select.setAttribute('data-account', JSON.stringify(account));
        select.innerText = '選択';

        select.addEventListener('click', (e) => {
            setCookieWithSetForm(e);
        });

        row.appendChild(id);
        row.appendChild(email);
        row.appendChild(select);
        accountRows.appendChild(row);
    }
}

/**
 *
 * @param e {MouseEvent}
 */
function setCookieWithSetForm(e) {
    const dom = e.currentTarget;
    const accountJson = dom.getAttribute('data-account');
    const account = JSON.parse(accountJson);

    const req = {
        'message': 'setCert',
        'cert': account.cert,
    };
    chrome.runtime.sendMessage(req);

    const mailInput = form.querySelectorAll('input[placeholder="Email address"], input[placeholder="メールアドレス"]');
    for (let input of mailInput) {
        input.value = account.email;
        let event = new Event('input');
        input.dispatchEvent(event);

        event = new Event('keydown');
        input.dispatchEvent(event);
    }

    const passwordInput = form.querySelectorAll('input[placeholder="Password"], input[placeholder="パスワード"]');
    for (let input of passwordInput) {
        input.value = account.password;
        const event = new Event('input');
        input.dispatchEvent(event);
    }

    const submit = form.querySelectorAll('button[type="submit"]');
    for (let input of submit) {
        input.disabled = false;
        input.classList.remove('ExDisabled');
    }
    document.body.removeChild(selectList);
}
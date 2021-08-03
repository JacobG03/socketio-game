
document.getElementById('button3').addEventListener('click', toggleUsernameMenu, false);
document.getElementById('return0').addEventListener('click', toggleMainMenu, false);


function toggleUsernameMenu() {
    let main_menu = document.getElementById('middle-default');
    let username_menu = document.getElementById('middle-username');
    
    main_menu.style.display = 'none';
    username_menu.style.display = 'flex';
}

function toggleMainMenu() {
    let main_menu = document.getElementById('middle-default');
    let username_menu = document.getElementById('middle-username');
    
    main_menu.style.display = 'flex';
    username_menu.style.display = 'none';
}

// Listen for input, save input as username in local storage
document.getElementById('username-input').addEventListener('keyup', function (e) {
    let username = document.getElementById('username-input').value;
    if (e.keyCode == 13) {
        saveUsername(username);
    }
});
document.getElementById('enter-input0').addEventListener('click', () => {
    let username = document.getElementById('username-input').value;
    saveUsername(username);
});


function saveUsername(username) {
    if (username.length > 0) {
        // If string contains only spaces
        if (!username.trim()) {
            let message = 'No invisibility mode for you sir.';
            sessionStorage.setItem('message', message);
            sessionStorage.setItem('notified', true);
            notify();
            return false;
        }
        // If input is valid
        localStorage.setItem('username', username);
        if (changeUsername()) {
            let message = 'Username saved.';
            sessionStorage.setItem('message', message);
            sessionStorage.setItem('notified', true);
            notify();
        }
        return true;
    }
    // If string is empty
    let message = 'Username must contain at least 1 character.';
    sessionStorage.setItem('message', message);
    sessionStorage.setItem('notified', true);
    notify();
    return false;
}


// 
function changeUsername() {
    let username_fields = document.getElementsByClassName('username-field');
    for(let i = 0; i < username_fields.length; i++) {
        username_fields[i].innerHTML = localStorage.getItem('username');
    }
    return true;
}

// Restore username data
function restoreUsername() {
    // Username
    let username_fields = document.getElementsByClassName('username-field');
    for(let i = 0; i < username_fields.length; i++) {
        if (localStorage.getItem('username')) {
            username_fields[i].innerHTML = localStorage.getItem('username');
        } else {
            username_fields[i].innerHTML = 'Anonymous';
        }
    }
    return true;
}

function restoreData() {
    restoreUsername();
    return true;
}

restoreData();



// Notification, inifine function calling
// if element exists, delete it, if not create it and wait 3sec
function notify() {
    let element = document.getElementsByClassName('notification')[0];
    if (element && !sessionStorage.getItem('notified')) {
        element.remove();
        let default_content = document.getElementById('bottom-default');
        default_content.style.display = 'flex';
    } else {
        if (sessionStorage.getItem('notified')) {
            let wrapper = document.getElementById('bottom-wrapper');
            let notification = document.createElement('div');
            notification.className = 'notification';
            wrapper.appendChild(notification);
    
            let text = document.createElement('h3');
            text.innerHTML = sessionStorage.getItem('message');
            notification.appendChild(text);
    
            let default_content = document.getElementById('bottom-default');
            default_content.style.display = 'none';

            sessionStorage.removeItem('notified');
    
            setTimeout(notify, 3000)
        }
    }
    return true;
}


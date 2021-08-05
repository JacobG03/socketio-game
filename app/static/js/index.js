// Listener to toggle back to home menu
const back = document.getElementsByClassName('return');
for (let i = 0; i < back.length; i++) {
    back[i].addEventListener('click', toggleContentDefault, false);
}


// Listeners to toggle content
const buttons = document.getElementsByClassName('button');
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', toggleContent, false);
}


// Toggle content after clicking button (1v1, settings etc)
function toggleContent() {
    let id = this.id.split('-')[1]
    let contents = document.getElementsByClassName('middle-content');
    for(let i = 0; i < contents.length; i++) {
        if (contents[i].id.split('-')[1] == id) {
            contents[i].style.display = 'flex';

            // Join Open room
            if (id == 1){
                joinGameOpen();
            }
            if (id == 4){
                renderImage();
            }
        } else {
            contents[i].style.display = 'none';
        }
    }
}


// Toggle home screen
function toggleContentDefault() {
    let contents = document.getElementsByClassName('middle-content');
    let home = document.getElementById('content-0');
    for(let i = 0; i < contents.length; i++) {
        contents[i].style.display = 'none';
    }
    home.style.display = 'flex';
}


// Listen for input, save input as 'username' in local storage
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



// Listen for input, save input (image link) as 'image'
document.getElementById('image-input1').addEventListener('keyup', function (e) {
    let image = document.getElementById('image-input1').value;
    if (e.keyCode == 13) {
        saveImage(image);
    }
});
document.getElementById('enter-input1').addEventListener('click', () => {
    let image = document.getElementById('image-input1').value;
    saveImage(image);
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


function saveImage(image) {
    // if link ends with these continue
    if (['png', 'jpg', 'jpeg', 'gif'].includes(image.split('.').pop())) {
        // if image doesnt exist on the page create one
        let find_image = document.getElementById('user-image');
        
        find_image.src = image;
        // save image link
        localStorage.setItem('image', image);

        // notification req
        sessionStorage.setItem('message', 'Image saved.');
        sessionStorage.setItem('notified', true);
        notify()
        
        // delete text from input field
        document.getElementById('image-input1').value = '';
        return true;
    }
    return false;
}


function renderImage() {
    let find_image = document.getElementById('user-image'); 
    if (!find_image) {
        let image = localStorage.getItem('image');
    
        let parent = document.getElementById('image-box');
        let img = document.createElement('img');
        if(image) { 
            img.src = image;
        } else {
            let default_image = 'https://avatarfiles.alphacoders.com/101/101741.jpg'
            img.src = default_image;

            localStorage.setItem('image', default_image);
        }
        img.id = 'user-image';
        parent.appendChild(img);
        return true;
    }
};


// Replace all necessary html fields with new username
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
            localStorage.setItem('username', 'Anonymous');
        }
    }
    return true;
}

// Restore saved data from local storage on page refresh
function restoreData() {
    restoreUsername();
    renderImage();
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
            sessionStorage.removeItem('message');
    
            setTimeout(notify, 3000)
        }
    }
    return true;
}




//* Game section - 'Open' mode

// Remove old data on refresh
function removePlayerData () {
    localStorage.removeItem('x');
    localStorage.removeItem('y');
    localStorage.removeItem('player-id');
}

removePlayerData();


var player = {}

var players = {}


function joinGameOpen() {
    var socket = io.connect('http://127.0.0.1:5000/')

    // send new player data
    retrieveData(socket);
    getPlayerData();

    socket.on('get player data', data => {
        createPlayer(data);
    }) 

    socket.on('create player', data => {
        createPlayer(data);
    }) 

    socket.on('retrieve players data', data => {
        players = data;
        console.log('retrieve players data', players)
    }) 
}


// return/set all necessary player data
function getPlayerData() {
    let id = getId();
    let username = localStorage.getItem('username');
    let image = localStorage.getItem('image');
    let x = 16;
    let y = 16;

    if (id == 0) {
        players[id] = player;
    }

    player['id'] = id;
    player['username'] = username;
    player['image'] = image;
    player['x'] = x;
    player['y'] = y;

    return player;
}


// Get id based on amount of players already in game
function getId() {
    let grid = document.getElementById('grid-open');
    return grid.children.length;
}


function createPlayer(data) {
    retrieveData();
    let heh = document.createElement('div');
    heh.className = 'player';
    heh.id = `player-${data.id}`;
    heh.style.backgroundColor = 'blue';
    document.getElementById('grid-open').appendChild(heh);
}


function retrieveData(socket) {
    if (oldestPlayer()) {
        socket.emit('send players data', players);
    };
}


function oldestPlayer() {
    let players = document.getElementsByClassName('player');
    if (players.length == 0) {
        return true;
    }
    else if (players[0].id.split('-')[1] == player.id) {
        return true;
    }
    return false;
}
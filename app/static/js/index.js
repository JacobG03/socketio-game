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
                // Check if username is set and if its not already taken
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


// This client 'player' data
var player = {}

// All clients 'player' data
var players = {}

// Prevents function from being called when another user joins
var movement_enabled = false;

const grid = document.getElementById('grid-open');


function joinGameOpen() {
    socket = io.connect('http://127.0.0.1:5000/');

    socket.emit('pass room data');

    let room_data = {
        'username': localStorage.getItem('username'),
        'room': 'open'
    }
    // Join 'open' room
    socket.emit('join', room_data);
    
    socket.on('get room data', data => {
        createPlayerData(data, socket);
    })

    socket.on('create players', data => {
        createPlayers(data);
        if (!movement_enabled) {
            sendMovementData(socket);
        }
    })

    socket.on('message', data => {
        console.log(data);
    })

    socket.on('get players data', data => {
        console.log(data, 'passed')
    })

    socket.on('update players', players_data => {
        console.log('update', players_data)
        createPlayers(players_data)
    })

    socket.on('remove player', data => {
        removePlayer(data);
    })

    socket.on('move player', data => {
        movePlayer(data);
    })
}


function createPlayerData (data, socket) {
    player['username'] = localStorage.getItem('username');
    player['image'] = localStorage.getItem('image');
    player['x'] = 16; 
    player['y'] = 16;
    
    socket.emit('add player data', player)
}


function createPlayers(data) {
    for (let [key, value] of Object.entries(data)) {
        let find_div = document.getElementById(`player-${value.username}`);
        if (!find_div) {
            let player_div = document.createElement('div');
            player_div.className = 'player';
            player_div.id = `player-${value.username}`;
            player_div.style.gridColumn = value.x;
            player_div.style.gridRow = value.y;
            grid.appendChild(player_div);
            
            let player_image = document.createElement('img');
            player_image.src = value.image;
            player_div.appendChild(player_image);
        }
    }
}


function removePlayer(data) {
    document.getElementById(`player-${data}`).remove();
}


function sendMovementData(socket) {
    movement_enabled = true;

    window.addEventListener('keydown', e => {
        updatePosition(e.keyCode);
        socket.emit('player movement data', {
            'username': player['username'],
            'direction': e.keyCode, 
            'id': `player-${player['username']}`,
            'x': player['x'],
            'y': player['y']
        })
    })
}


function updatePosition (direction) {
    // Left
    if (direction == 65) {
        if (player['x'] - 1 > 0) {
            player['x'] -= 1;
        }
    }
    // Right
    if (direction == 68) {
        if (player['x'] + 1 <= 32) {
            player['x'] += 1;
        }
    }
    // Up
    if (direction == 87) {
        if (player['y'] - 1 > 0) {
            player['y'] -= 1;
        }
    }
    //Down
    if (direction == 83) {
        if (player['y'] + 1 <= 32) {
            player['y'] += 1;
        }
    }
}


function movePlayer (data) {
    let player_div = document.getElementById(data.id);
    // Left
    if (data.direction == 65) {
        player_div.style.gridColumn = data.x;
    }
    // Right
    if (data.direction == 68) {
        player_div.style.gridColumn = data.x;
    }
    // Up
    if (data.direction == 87) {
        player_div.style.gridRow = data.y;
    }
    //Down
    if (data.direction == 83) {
        player_div.style.gridRow = data.y;
    }
}
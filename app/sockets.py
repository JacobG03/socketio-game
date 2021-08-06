from app import socketio
from flask_socketio import emit, join_room, leave_room, send, rooms
from flask import session


in_room = []
players_data = {}


@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    session['username'] = username
    session['room'] = room

    join_room(room)
    in_room.append(username)
    send(username + ' has entered the room.', room=room)
    emit('update players', players_data, broadcast=True)
    print(in_room)


@socketio.on('disconnect')
def disconnect():
    # Data necessary to leave the room
    username = session['username']
    room = session['room']

    # Remove player for players dictionary
    players_data.pop(session['username'])
    # Remove player from in_room list
    in_room.remove(session['username'])

    leave_room(room)
    send(username + ' has left the room.', room=room)
    
    emit('remove player', session['username'], broadcast=True)

    print(in_room)
    print(players_data)


@socketio.on('pass room data')
def pass_room_data():
    emit('get room data', in_room)


@socketio.on('add player data')
def add_player_data(player_data):
    players_data[player_data['username']] = player_data
    print(players_data)
    emit('create players', players_data, broadcast=True)


@socketio.on('pass players data')
def pass_players_data():
    print(players_data)
    emit('get players data', players_data)


@socketio.on('player movement data')
def player_movement_data(data):
    players_data[data['username']]['x'] = data['x']
    players_data[data['username']]['y'] = data['y']
    emit('move player', data, broadcast=True)
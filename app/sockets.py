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
    print(in_room)


@socketio.on('disconnect')
def disconnect():
    username = session['username']
    room = session['room']

    in_room.remove(username)
    leave_room(room)
    send(username + ' has left the room.', room=room)
    print(in_room)


@socketio.on('pass room data')
def pass_room_data():
    emit('get room data', in_room)


@socketio.on('add player data')
def add_player_data(player_data):
    players_data[player_data['id']] = player_data
    print(players_data)
    emit('create players', players_data)


@socketio.on('pass players data')
def pass_players_data():
    emit('get players data', players_data)
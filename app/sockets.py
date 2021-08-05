from app import socketio
from flask_socketio import emit, join_room, leave_room, send, rooms
from flask import session


players = []


@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    session['username'] = username
    session['room'] = room

    join_room(room)
    players.append(username)
    send(username + ' has entered the room.', room=room)



@socketio.on('disconnect')
def disconnect():
    username = session['username']
    room = session['room']

    players.remove(username)
    leave_room(room)
    send(username + ' has left the room.', room=room)
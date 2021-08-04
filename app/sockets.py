from app import socketio
from flask_socketio import emit


@socketio.on('get player data')                         
def test_message(data):
    emit('create player', data, broadcast=True)      
            
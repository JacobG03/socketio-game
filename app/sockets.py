from app import socketio
from flask_socketio import emit


@socketio.on('my event')                         
def test_message(message):                        
    print('works')
    emit('my response', {'data': 'got it!'}, broadcast=True)      
            
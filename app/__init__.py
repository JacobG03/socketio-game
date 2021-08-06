import eventlet
eventlet.monkey_patch()

from flask import Flask
from flask_socketio import SocketIO
from config import Config


app = Flask(__name__)
app.config.from_object(Config)
socketio = SocketIO(app)
app.static_folder = 'static'


from app import routes, sockets
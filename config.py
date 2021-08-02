import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    # General
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'my-secret-key'
from flask import render_template
from app import app


@app.get('/')
@app.post('/')
def index():
    return render_template('index.html', title='Home')
import os
from flask import Flask, render_template, request, jsonify
from flask_wtf.csrf import CSRFProtect

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCRATCHPAD = os.environ.get('SCRATCHPAD_PATH', os.path.join(BASE_DIR, 'scratchpad.txt'))

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', os.urandom(24))
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024  # 1 MB

csrf = CSRFProtect(app)


@app.route('/')
def index():
    try:
        with open(SCRATCHPAD, 'r') as file:
            content = file.read()
    except FileNotFoundError:
        content = ""
    return render_template('index.html', content=content)


@app.route('/save', methods=['POST'])
def save():
    content = request.form.get('content', '')
    tmp = SCRATCHPAD + '.tmp'
    with open(tmp, 'w') as file:
        file.write(content)
    os.replace(tmp, SCRATCHPAD)
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    app.run(debug=os.environ.get('FLASK_DEBUG', 'false').lower() == 'true')

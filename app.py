from flask import Flask, request, render_template
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/save', methods=['POST'])
def save():
    content = request.form['content']
    with open('scratchpad.txt', 'w') as f:
        f.write(content)
    return 'Content saved successfully'

if __name__ == '__main__':
    app.run(debug=True)

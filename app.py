from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    try:
        with open('scratchpad.txt', 'r') as file:
            content = file.read()
    except FileNotFoundError:
        content = ""
    return render_template('index.html', content=content)

@app.route('/save', methods=['POST'])
def save():
    content = request.form['content']
    with open('scratchpad.txt', 'w') as file:
        file.write(content)
    return 'Content saved successfully'

if __name__ == '__main__':
    app.run(debug=True)

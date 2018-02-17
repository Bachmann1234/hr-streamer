from flask import Flask, request
app = Flask(__name__)

@app.route('/', methods=['POST'])
def print_hr():
    data = request.get_json();
    hr = data.get('hr', "-1")
    timestamp = data.get('timestamp', '-1')
    print("{} {}".format(hr, timestamp))
    return 'ok'

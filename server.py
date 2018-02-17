from flask import Flask, request
app = Flask(__name__)

@app.route('/')
def print_hr():
    hr = request.args.get('hr', '')
    timestamp = request.args.get('timestamp', '')
    print("{} {}".format(hr, timestamp))
    return 'ok'

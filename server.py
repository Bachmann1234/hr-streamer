from flask import Flask, request
app = Flask(__name__)

@app.route('/', methods=['POST'])
def print_hr():
    data = request.get_json();
    user_id = data.get('userId', '-1')
    hr = data.get('hr', "-1")
    timestamp = data.get('timestamp', '-1')
    print("User {} had a heartrate of {} on {}".format(user_id, hr, timestamp))
    return 'ok'

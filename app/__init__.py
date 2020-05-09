from flask import *

app = Flask(__name__)


@app.route('/', methods=['GET'])
def index():
    return render_template("index.html")

@app.route("/api")
def api():
    return request.args;

if __name__ == "__main__":
    app.run()

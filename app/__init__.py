from flask import *
from random import random
from collections import defaultdict

app = Flask(__name__)


@app.route('/', methods=['GET'])
def index():
    return render_template("index.html")


@app.route("/api")
def api():
    print('--------------')
    pat = [1, 2, 3]
    lsts = (
        [0, 5, 1, 2, 3, 4, 6, 7],
        [1, 5, 1, 2, 3, 4, 6, 8],
        [3, 2, 1, 1, 1, 2, 3, 10, 20],
        [3, 2, 1, 1, 1, 2, 3, 10, 20],
    )
    names = (
        'label 1',
        'label 2',
        'label 3',
        'label 4',
    )

    def randcol():
        return [int(random() * 255), int(random() * 255), int(random() * 255)]

    splits = []
    cols = []

    for i in lsts:
        cols.append(randcol())
        ps = 0
        for j in range(len(i) - len(pat) + 1):
            print(j, i[j:j + len(pat)], pat, i[j:j + len(pat)] == pat)
            if i[j:j + len(pat)] == pat:
                ps = j
                break

        splits.append((i[0:ps + 1][::-1], i[ps + len(pat) - 1:]))

    nodes = set()
    nodes_eq = defaultdict(list)
    edges = defaultdict(list)

    for n in range(len(splits)):
        i = splits[n]
        for j in range(len(i[0])):
            nodes.add('left_pos%d_%d' % (j, i[0][j]))

            if j != 0:
                nodes_eq['left_pos%d_%d' % (j, i[0][j])].append(n)

        for j in range(len(i[0]) - 1):
            edges[('left_pos%d_%d' % (j, i[0][j]), 'left_pos%d_%d' % (j, i[0][j + 1]))].append(n)

        for j in range(len(i[1])):
            nodes.add('right_pos%d_%d' % (j, i[1][j]))

            if j != 0:
                nodes_eq['right_pos%d_%d' % (j, i[1][j])].append(n)

        for j in range(len(i[1]) - 1):
            edges[('right_pos%d_%d' % (j, i[1][j]), 'right_pos%d_%d' % (j, i[1][j + 1]))].append(n)

    ret_links = []

    for i, j in edges.items():
        print(i, j)
        for k in j:
            ret_links.append({
                'source': i[0],
                'target': i[1],
                'value': 1,
                'color': cols[k],
                'multi': len(j) != 1,
                'multicount': len(j)
            })

    # print(ret_links)
    print(nodes_eq)

    return request.args


if __name__ == "__main__":
    app.run()

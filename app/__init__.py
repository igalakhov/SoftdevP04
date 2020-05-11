from flask import *
from random import random
from collections import defaultdict
from json import dumps
from pyoeis import OEISClient

app = Flask(__name__)


@app.route('/', methods=['GET'])
def index():
    return render_template("index.html")


@app.route("/debug")
def debug():
    return {

        "nodes": [
            {"id": "0", "fx": 441, "fy": 334, "central": True},
            {"id": "1", "fx": 513, "fy": 332, "central": True},
            {"id": "2", "fx": 593, "fy": 330, "central": True},
            {"id": "4", "equation": ["x^2"]},
            {"id": "5"},
            {"id": "9"},
            {"id": "10"},
            {"id": "11"},
            {"id": "12"}
        ],
        "links": [

            {"source": "4", "target": "0", "value": 1},
            {"source": "5", "target": "0", "value": 1},
            {"source": "0", "target": "1", "value": 1},
            {"source": "1", "target": "2", "value": 1},
            {"source": "2", "target": "9", "value": 1},
            {"source": "2", "target": "10", "value": 1},
            {"source": "2", "target": "11", "value": 1},
            {"source": "10", "target": "12", "value": 1}
        ]
    }


@app.route("/api")
def api():
    if 'int1' not in request.args or 'int2' not in request.args or 'int3' not in request.args or 'maxcount' not in request.args or 'maxext' not in request.args:
        return '{}'

    pat = [int(request.args['int1']), int(request.args['int2']), int(request.args['int3'])]
    cnt = int(request.args['maxcount'])
    ext = int(request.args['maxext'])

    client = OEISClient()

    res = client.lookup_by(prefix='%d,%d,%d' % tuple(pat), query='', max_seqs=cnt, list_func=True)

    # for i in res:
    #     print(i.unsigned_list, i.signed_list)

    lsts = tuple(
        i.unsigned_list if len(i.signed_list) == 0 else i.signed_list for i in res
    )

    names = tuple(
        i.name for i in res
    )

    # print(lsts)
    # print(names)

    def randcol():
        return [int(random() * 255), int(random() * 255), int(random() * 255)]

    splits = []
    cols = []

    for i in lsts:
        cols.append(randcol())
        ps = 0
        for j in range(len(i) - len(pat) + 1):
            # print(j, i[j:j + len(pat)], pat, i[j:j + len(pat)] == pat)
            if i[j:j + len(pat)] == pat:
                ps = j
                break

        l1 = i[0:ps + 1][::-1]
        l2 = i[ps + len(pat) - 1:]
        splits.append((l1[0:ext], l2[0:ext]))

    nodes = set()
    nodes_eq = defaultdict(list)
    edges = defaultdict(list)

    for n in range(len(splits)):
        i = splits[n]
        for j in range(len(i[0])):
            nodes.add('left_%d_%d' % (j, i[0][j]))

            if j != 0:
                nodes_eq['left_%d_%d' % (j, i[0][j])].append(names[n])

        for j in range(len(i[0]) - 1):
            edges[('left_%d_%d' % (j, i[0][j]), 'left_%d_%d' % (j + 1, i[0][j + 1]))].append(n)

        for j in range(len(i[1])):
            nodes.add('right_%d_%d' % (j, i[1][j]))

            if j != 0:
                nodes_eq['right_%d_%d' % (j, i[1][j])].append(names[n])

        for j in range(len(i[1]) - 1):
            edges[('right_%d_%d' % (j, i[1][j]), 'right_%d_%d' % (j + 1, i[1][j + 1]))].append(n)

    ret_links = []
    ret_nodes = []

    for i, j in edges.items():
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
    # print(nodes_eq)

    for i, j in nodes_eq.items():
        ret_nodes.append({
            'id': i,
            'label': i.split('_')[1],
            'equation': j
        })

    ret_nodes.append({
        'id': 'left_%d_%d' % (0, pat[0]),
        'label': str(pat[0]),
        'fx': 441,
        'fy': 334,
        'central': True,
        'equation': list(names)
    })

    ret_nodes.append({
        'id': 'center_center',
        'label': str(pat[0]),
        'fx': 513,
        'fy': 332,
        'central': True,
        'equation': list(names)
    })

    ret_nodes.append({
        'id': 'right_%d_%d' % (0, pat[2]),
        'label': str(pat[2]),
        'fx': 593,
        'fy': 330,
        'central': True,
        'equation': list(names)
    })

    ret_links.append({
        'source': 'left_%d_%d' % (0, pat[0]),
        'target': 'center_center',
        'value': 1,
        'color': [0, 0, 0],
        'multi': False
    })

    ret_links.append({
        'source': 'right_%d_%d' % (0, pat[2]),
        'target': 'center_center',
        'value': 1,
        'color': [0, 0, 0],
        'multi': False
    })

    return {
        'nodes': ret_nodes,
        'links': ret_links
    }


if __name__ == "__main__":
    app.run()

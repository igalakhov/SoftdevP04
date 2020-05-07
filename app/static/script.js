
var svg = d3.select("svg"),
	width = +svg.attr("width"),
	height = +svg.attr("height");


var simulation = d3.forceSimulation()
	.force("link", d3.forceLink().id(function (d) { return d.id; }))
	//.force("charge", d3.forceManyBody().strength(-200))
	.force('charge', d3.forceManyBody()
		.strength(-200)
		.theta(0.8)
		.distanceMax(150)
	)
	// 		.force('collide', d3.forceCollide()
	//       .radius(d => 40)
	//       .iterations(2)
	//     )	
	.force("center", d3.forceCenter(width / 2, height / 2));


let graph = {
	// "nodes": [
	// 	{ "id": "3", "group": 1 },
	// 	{ "id": "4", "group": 2 },
	// 	{ "id": "5", "group": 3 },
	// 	{ "id": "0", "group": 4 , fx:441, fy:334},
	// 	{ "id": "1", "group": 5 , fx:513, fy:332},
	// 	{ "id": "2", "group": 1 , fx:593, fy:330},
	// 	{ "id": "9", "group": 2 },
	// 	{ "id": "10", "group": 3 },
	// 	{ "id": "11", "group": 4 },
	// 	{ "id": "12", "group": 5 }
	// ],

	"nodes": [
		{ "id": "0", fx: 441, fy: 334 , central:true},
		{ "id": "1", fx: 513, fy: 332 , central:true},
		{ "id": "2", fx: 593, fy: 330 , central:true},
		{ "id": "3" },
		{ "id": "4" },
		{ "id": "5" },
		{ "id": "9" },
		{ "id": "10"},
		{ "id": "11"},
		{ "id": "12"}
	],
	"links": [
		// { "source": "3", "target": "4", "value": 1 },
		// { "source": "3", "target": "5", "value": 1 },

		{ "source": "4", "target": "0", "value": 1 },
		{ "source": "5", "target": "0", "value": 1 },

		{ "source": "0", "target": "1", "value": 1 },
		{ "source": "1", "target": "2", "value": 1 },
		{ "source": "2", "target": "9", "value": 1 },
		{ "source": "2", "target": "10", "value": 1 },
		{ "source": "2", "target": "11", "value": 1 },
		{ "source": "10", "target": "12", "value": 1 }
	]
}

function get(url, callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(xmlHttp.responseText);
	}
	xmlHttp.open("GET", url, true); 
	xmlHttp.send(null);
}




function run(graph) {

	graph.links.forEach(function (d) {
		//     d.source = d.source_id;    
		//     d.target = d.target_id;
	});

	var link = svg.append("g")
		.style("stroke", "#aaa")
		.selectAll("line")
		.data(graph.links)
		.enter().append("line");

	var node = svg.append("g")
		.attr("class", "nodes")
		.selectAll("circle")
		.data(graph.nodes)
		.enter().append("circle")
		.attr("r", 2)
		.call(d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended));

	var label = svg.append("g")
		.attr("class", "labels")
		.selectAll("text")
		.data(graph.nodes)
		.enter().append("text")
		.attr("class", "label")
		.text(function (d) { return d.id; });

	simulation
		.nodes(graph.nodes)
		.on("tick", ticked);

	simulation.force("link")
		.links(graph.links);

	function ticked() {
		link
			.attr("x1", function (d) { return d.source.x; })
			.attr("y1", function (d) { return d.source.y; })
			.attr("x2", function (d) { return d.target.x; })
			.attr("y2", function (d) { return d.target.y; });

		node
			.attr("r", function(d){ if (d.central){return 20} else {return 16}})
			.style("fill", "#efefef")
			.style("stroke", "#424242")
			.style("stroke-width", "1px")
			.attr("cx", function (d) { return d.x + 5; })
			.attr("cy", function (d) { return d.y - 3; });

		label
			.attr("x", function (d) { return d.x; })
			.attr("y", function (d) { return d.y; })
			.style("font-size", "10px").style("fill", "#333");
	}
}

function dragstarted(d) {
	if (!d3.event.active) simulation.alphaTarget(0.3).restart()
	d.fx = d.x
	d.fy = d.y
	//  simulation.fix(d);
}

function dragged(d) {
	d.fx = d3.event.x
	d.fy = d3.event.y
	//  simulation.fix(d, d3.event.x, d3.event.y);
}

function dragended(d) {
	d.fx = d3.event.x
	d.fy = d3.event.y
	if (!d3.event.active) simulation.alphaTarget(0);
	//simulation.unfix(d);
}


run(graph);


var svgnode = document.getElementById("svg");

var clear = function () {
	var curr = svgnode.firstChild;
	while (curr) {
		svgnode.removeChild(curr);
		curr = svgnode.firstChild;
	}
}

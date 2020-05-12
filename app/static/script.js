
// SVG CODE
var svg = d3.select("svg"),
	width = +svg.attr("width"),
	height = +svg.attr("height");


var simulation = d3.forceSimulation()
	.force("link", d3.forceLink().id(function (d) { return d.id; }))
	//.force("charge", d3.forceManyBody().strength(-200))
	.force('charge', d3.forceManyBody()
		.strength(-1000)
		// .theta(2)
		.distanceMax(400)
		.distanceMin(0)
	)
	.force('collision', d3.forceCollide().radius(16))
	// .force('collision', d3.forceCollide().radius(30))
	// .forceX()
	.force("x", d3.forceX(function (d){return 500}))
	.force("y", d3.forceY(600))
	.force("center", d3.forceCenter(500, 500))
	;
	// 		.force('collide', d3.forceCollide()
	//       .radius(d => 40)
	//       .iterations(2)
	//     )	
	// .force("center", d3.forceCenter(width / 2, height / 2));

// function xcoorforcecalc(d){
// 	if 
// }

let graph = {

	"nodes": [
		{ "id": "0", "fx": 441, "fy": 700 , "central":true},
		{ "id": "1", "fx": 513, "fy": 700 , "central":true},
		{ "id": "2", "fx": 593, "fy": 700 , "central":true},
		{ "id": "4" , "equation":["x^2"]},
		{ "id": "5" },
		{ "id": "9" },
		{ "id": "10"},
		{ "id": "11"},
		{ "id": "12"}
	],
	"links": [

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

console.log("HELLO I AM THE INIT JSON")
console.log(typeof(graph))

function httpGet(theUrl) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", theUrl, false); // false for synchronous request
	xmlHttp.send(null);
	return xmlHttp.responseText;
}

function httpGetAsync(theurl, callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(xmlHttp.responseText);
	}
	xmlHttp.open("GET", theurl, true); // true for asynchronous 
	xmlHttp.send(null);
}

function mouseover(d){
	// font-family="sans-serif" font-size="20px"

	for (i = 0; i < d.equation.length; i++) {
		svg.append("text")
			.attr("fill", "red")
			.attr("id", "hover")
			.attr("x", d.x + 0)
			.attr("y", (d.y - 50) +  (15*i))
			.text(d.equation[i]);
	}
	console.log(d);
}

function mouseout(d){
	console.log(d);
	var elem = document.querySelector("#hover");
	while (elem != null){
		elem.parentNode.removeChild(elem);
		elem = document.querySelector("#hover");
	}
}


function run(graph) {

	// graph.links.forEach(function (d) {
	// 	//     d.source = d.source_id;    
	// 	//     d.target = d.target_id;
	// });
	
	d3.selectAll("svg > *").remove();

	if (typeof(graph) == ("string")){
		graph = JSON.parse(graph);
	}

	console.log(graph);

	var link = svg.append("g")
		.style("stroke", "#aaa")
		.style("stroke-width", 10)
		.selectAll("line")
		.data(graph.links)
		.enter().append("line");

	var node = svg.append("g")
		.attr("class", "nodes")
		.selectAll("circle")
		.data(graph.nodes)
		.enter().append("circle")
		.attr("r", 2)
		// .attr("cx", 500)
		// .attr("cy", 500)
		// .attr("x", 500)
		// .attr("y", 500)
		.attr("vx", .05)
		.attr("vy", .05)
		.call(d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended))
		.on("mouseover", mouseover)
		.on("mouseout", mouseout);

	var label = svg.append("g")
		.attr("class", "labels")
		.selectAll("text")
		.data(graph.nodes)
		.enter().append("text")
		.attr("class", "label")
		.text(function (d) { return d.label; });

	simulation.restart();

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
			.attr("y2", function (d) { return d.target.y; })
			.style("stroke", function (d) { return rgbToHex(d.color[0], d.color[1], d.color[2]) });

		node
			.attr("r", function(d){; if (d.central){return 30} else {return 25}})
			.style("fill", "#efefef")
			.style("stroke", "#424242")
			.style("stroke-width", "1px")
			.attr("cx", function (d) { return d.x + 5; })
			.attr("cy", function (d) { return d.y - 3; });

		label
			.attr("x", function (d) { return d.x; })
			.attr("y", function (d) { return d.y; })
			.style("font-size", "20px").style("fill", "#333");
	}
}


function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
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

var clear = function () {
	var curr = svgnode.firstChild;
	while (curr) {
		svgnode.removeChild(curr);
		curr = svgnode.firstChild;
	}
}

var hackclear = function () {
	svg.append("g").append("rect").attr("width", 960).attr("height", 600).attr("style", "fill:rgb(255,255,255);");
}

// httpGetAsync("/api?int1=3&int2=5&int3=8&maxcount=3&maxext=4", run);

httpGetAsync("/default", run);

var submit = function () {
	inp1 = document.getElementById("inp1").value;
	inp2 = document.getElementById("inp2").value;
	inp3 = document.getElementById("inp3").value;
	maxc = 3;
	maxext = 4;
	query0 = `/api?int1=${inp1}&int2=${inp2}&int3=${inp3}&maxcount=${maxc}&maxext=${maxext}`;
	console.log(query0);
	httpGetAsync(query0, run);
}
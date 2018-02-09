---
---
function _debounce (fn, delay) {
  var timer = null;
  return function () {
    // log('debounce!');
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

function _log() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift("[📺]");
  console.log.apply(console, args);
}


function M(options) {
  var _self = this;

  this.ticked = function() {
    _self.link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    // bound to border
    _self.node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    // _self.node
    //     .attr("cx", function(d, i) { 
    //       // if(i==0)
    //       //   console.log(d.x, _self.width)
    //       return d.x; })
    //     .attr("cy", function(d) { return d.y; });
  }

  this.render = function(){
    _log('graph.render', _self.graph);

    // resize svg
    _self.svg
      .attr('width', _self.width)
      .attr('height', _self.height);

    _self.node = _self.node.data(_self.graph.nodes, function(d) { return d.id;});
    _self.node.exit().remove();
    _self.node = _self.node.enter().append("g").attr("class", function(d){
      return d.type
    }).merge(_self.node);
    _self.node.append("circle")
      // .attr("fill", function(d,i){ return i==0?'magenta':'cyan'})
      .attr("r", 16);
    _self.node.append("text")
      .attr("dx", 25)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });

    // _self.node.append("image")
    //   .attr("xlink:href", "https://github.com/favicon.ico")
    //   .attr("x", -8)
    //   .attr("y", -8)
    //   .attr("width", 16)
    //   .attr("height", 16);

    _self.node.call(d3.drag()
      .on("start", _self.ondragstarted)
      .on("drag", _self.ondragged)
      .on("end", _self.ondragended));
    
    // Apply the general update pattern to the links.
    _self.link = _self.link.data(_self.graph.links, function(d) { return d.source.id + "-" + d.target.id; });
    _self.link.exit().remove();
    _self.link = _self.link.enter().append("line").merge(_self.link);

    // Update and restart the simulation.
    _self.simulation.force("center", d3.forceCenter(this.width/2, this.height/2))
    _self.simulation.nodes(_self.graph.nodes);
    _self.simulation.force("link").links(_self.graph.links);
    _self.simulation.restart();


     
   
  }

  this.resize = function() {

    // reposition elements
    var rect = this.container.getBoundingClientRect();

    this.width  = rect.width;
    this.height = rect.height;

    _log('graph.resize - width:', this.width, '- height', this.height);
    
    if(this.graph)
      this.render();
  }


  this.init = function(svg) {
    this.svg = d3.select(svg);
    this.container = this.svg.node().parentNode;

    // init link and node collections
    this.link = this.svg.append("g").classed("links", true).selectAll("line");
    this.node = this.svg.append("g").classed("nodes", true).selectAll("circle");

    
    // init force!
    this.simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(100))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(150, 150))
      //.alphaTarget(1)
      .on("tick", this.ticked)

    _log('graph.init');
    
    // set width, height
    this.resize();

    window.addEventListener('resize', _self.onresize, false);
  }

  this.update = function(graph) {
    _log('graph.update', graph)

    this.graph = {};

    this.graph.links = graph.links.filter(function(d){
      return d.source;
    })
    this.graph.nodes = graph.nodes.filter(function(d){
      return d.id;
    })
    this.render();
  }

  this.onresize = _debounce(_self.resize, 500);

  this.ondragstarted = function(d) {
    if (!d3.event.active) 
      _self.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  this.ondragged = function(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  this.ondragended = function(d) {
    if (!d3.event.active)
      _self.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  this.init(options.svg )
}

document.addEventListener("DOMContentLoaded", function(e) {

  d3.json("{{"/assets/data/graph.json"| relative_url }}", function(error, graph) {
    if (error) throw error;
      console.log(graph)
      graph.links = graph.links.filter(function(d){
      return d._id;
    })
    // resize the canvas to fill browser window dynamically
    var m = new M({
      svg: '#svg-graph'
    });

    m.update(graph)
  });
})
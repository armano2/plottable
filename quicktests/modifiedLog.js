
function makeData() {
  return [makeRandomData(50), makeRandomData(50)];
  
}

function run(div, data, Plottable) {
  var svg = div.append("svg").attr("height", 500);

  var bigger = function(d){
    d.x = Math.pow(100, d.x);
    d.y = Math.pow(100, d.y);
  }

  var d1 = makeRandomData(50);
  d1.forEach(bigger);
  var d2 = makeRandomData(50);
  d2.forEach(bigger);
  var d3 = makeRandomData(50);
  d3.forEach(bigger);
  var d4 = makeRandomData(50);
  d4.forEach(bigger);


    //data
  dataseries1 = new Plottable.DataSource(d1);
  dataseries1.metadata({name: "series1"});
  dataseries2 = new Plottable.DataSource(d2);
  dataseries2.metadata({name: "series2"});
  dataseries3 = new Plottable.DataSource(d3);
  dataseries3.metadata({name: "series3"});
  dataseries4 = new Plottable.DataSource(d4);
  dataseries4.metadata({name: "series4"});


  var colorScale1 = new Plottable.Scale.Color();
  colorScale1.domain(["series1", "series2", "series3", "series4"]);

  xScale = new Plottable.Scale.ModifiedLog();
  yScale = new Plottable.Scale.ModifiedLog();
  var xAxis = new Plottable.Axis.Numeric(xScale, "bottom");
  var yAxis = new Plottable.Axis.Numeric(yScale, "left");

  var colorProjector = function(d, i, m) {
    return colorScale1.scale(m.name);
  };

  //rendering
  plot1 = new Plottable.Plot.Line(dataseries1, xScale, yScale);   
  plot2= new Plottable.Plot.Line(dataseries2, xScale, yScale);
  plot3 = new Plottable.Plot.Line(dataseries3, xScale, yScale);
  plot4 = new Plottable.Plot.Line(dataseries4, xScale, yScale);
  plot1.project("stroke", colorProjector);
  plot2.project("stroke", colorProjector);
  plot3.project("stroke", colorProjector);
  plot4.project("stroke", colorProjector);
  renderAreas = plot1.merge(plot2)
  .merge(plot3).merge(plot4);
  var renderers = [plot1, plot2, plot3, plot4];
  var renderersIncluded = [1, 1, 1, 1];


  //title + legend
  var title1 = new Plottable.Component.TitleLabel( "Two Data Series", "horizontal");
  var legend1 = new Plottable.Component.Legend(colorScale1);
  legend1.toggleCallback(
    function (d, b) {
      var index = colorScale1.domain().indexOf(d);
      if(renderersIncluded[index]){
        renderers[index].detach();
        renderersIncluded[index] = 0;
      } else{
        renderAreas.merge(renderers[index]);
        renderersIncluded[index] = 1;
      }
    }
    );
  var titleTable = new Plottable.Component.Table().addComponent(0,0, title1)
  .addComponent(0,1, legend1);

  basicTable = new Plottable.Component.Table().addComponent(0,2, titleTable)
  .addComponent(1, 1, yAxis)
  .addComponent(1, 2, renderAreas)
  .addComponent(2, 2, xAxis)

  basicTable.renderTo(svg);
  flipData();

  function flipy(element, index, array) {
    element.y = -1 * element.y;
  }
  function flipx(element, index, array) {
    element.x = -1 * element.x;
  }

  function flipData(){
    ds = dataseries4.data();
    ds.forEach(flipy);
    dataseries4.data(ds);  

    ds = dataseries3.data();
    ds.forEach(flipy);
    ds.forEach(flipx);
    dataseries3.data(ds);

    ds = dataseries2.data();
    ds.forEach(flipx);
    dataseries2.data(ds);   
  }
}
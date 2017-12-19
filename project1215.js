var viewWidth = 1150;
var viewHeight = 560;
d3.select(window).on("resize", resize);
var index = 0;

var margin = {top: 20, right: 20, bottom: 100, left: 40},
    width = viewWidth - margin.left - margin.right,
    height = viewHeight - margin.top - margin.bottom;

var data = happiness_data.data;
var data_copy, 
    cur_data = data[0];
var cnt, len = cur_data.length;

//stacked bar chart
var key = d3.keys(cur_data[0]).filter(function(d){return d!="Country" && d!="Score" && d!="Rank" && d!="Region"});
var stack = d3.stack()
          .keys(key);
var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1); // value -> display
var xAxis = d3.axisBottom().scale(xScale);
var yScale = d3.scaleLinear().range([height, 0]); // value -> display
var yAxis = d3.axisLeft().scale(yScale);
var z_westernEU= d3.scaleOrdinal()
          .range(["#688597"," #466c82", "#153f59", "#052d44", "#51588c", "#757aa3", "#a0acec"]);
var z_americas = d3.scaleOrdinal()
          .range(["#c5cd95", "#9fbe62", "#5f8218", "#436402", "#1e7215", "#5d9756", "#99c293"]);
var z_subAfrica = d3.scaleOrdinal()
          .range(["#ec9f9f", "#cc6969", "#8b1a1a", "#6b1212", "#8b4d3a", "#cc9669", "#fcd2af"]);
var z_centralEU = d3.scaleOrdinal()
          .range(["#7f74a3", "#5e5083", "#3b2b70", "#190a4a", "#53136f", "#a57aa3", "#d5bcec"]);
var z_asia =  d3.scaleOrdinal()
          .range(["#ecbf68", "#cb952b", "#8b5c00", "#684510", "#8b7510", "#cba12b", "#eedb88"]);
var z_mid= d3.scaleOrdinal()
          .range(["#7c6b78"," #5c5058", "#33333f", "#281c32", "#54444b", "#746764", "#a8a3b9"]);
var color = ["#688597", "#5e5083", "#9fbe62", "#cb952b", "#cc6969", "#5c5058"];
var regions = ["Western Europe", "Central and Eastern Europe", "Americas", "Asia", "Africa", "Middle East"]
var E_val=10, F_val=10, H_val=10, T_val=10, Fd_val=10, G_val=10, D_val=10;
var ifsort=1;

var serie;
var svg = d3.select("svg")
    .attr("width", viewWidth)
    .attr("height", viewHeight)
    .append("g")
    .attr("transform", "translate(" + (margin.left )+ "," + (margin.top) + ")");
var svgLegend = d3.select(".legend").append("svg")
            .attr("width", 500)
            .attr("height", 100);
var legend = svgLegend.selectAll(".legend1")
                .data(regions)
                .enter().append("g")
                .attr("transform", function (d, i) {
                  if(i>2){
                    return "translate(200," + (i-3)*20 + ")";
                  }
                  else{
                    return "translate(0," + i * 20 + ")";
                  }
                });
legend.append("rect")
      .attr("x","0")
      .attr('y',"0")
      .attr("width","15")
      .attr("height","15")
      .style("fill",function(d,i){return color[i]})
legend.append('text')
          .attr("x", 20)
          .attr("y", 10)
          .text(function (d, i) {
            return d;
        })
          .attr("class","legendFont")
          .style("text-anchor", "start")

//Tooltip
/*var viewWidth2 = 400, viewHeight2 = 300;
var width2 = viewWidth2 - margin.left - margin.right,
    height2 = viewHeight2 - margin.top - margin.bottom;
var xScale2 = d3.scaleTime()
                .domain([new Date(2014, 0, 1), new Date(2018, 0, 1)])
                .rangeRound([0, width2]);
    xAxis2 = d3.axisBottom(xScale2).tickFormat(d3.timeFormat("%Y"));
var yScale2 = d3.scaleLinear().range([height2, 0]),
    yAxis2 = d3.axisLeft(yScale2);*/

var div = d3.select("body").append("div")
			 .attr("class","tooltip")
			 .style("opacity","0");

/*var svg2 = div.append("svg")
  			 .attr("width", viewWidth2)
  			 .attr("height", viewHeight2)
         .append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");*/


// radar chart
var w = 200,
    h = 200;

function clicksort(value){
  update();
ifsort = value;
  if (value==0){ 
    data_copy.sort(function (a, b) {
    return b.total-a.total;});
  }
  else if(value==1){
    update();
  }
    updatePoints(E_val,H_val,F_val,T_val,Fd_val,G_val,D_val);
}

function drawBarChart(){
	updateRank(cur_data);
	var yExtent = d3.extent(cur_data, function(d){return d["Score"];});
    xScale.domain(cur_data.map(function(d){return d["Country"];}));
    yScale.domain([0,d3.max(yExtent)]).nice();

    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(0," + height +")" )
       .attr("font-weight","bold")
       .call(xAxis)
       .selectAll("text")
           .style("text-anchor","end")
           .attr("dx","-.8em")
           .attr("dy",".15em")
           .attr("transform", "rotate(-50)")
           .attr("font-weight", "bold");

    svg.append("g")
       	   .attr("class", "axis")
           .call(yAxis)
       .append("text")
           .attr("dy", "0.25em")
           .attr("x", 2)
           .attr("text-anchor", "start")
           .attr("fill", "#000")
           .text("Score");
    cnt = -1;
    serie= svg.selectAll(".serie")
          .data(stack(cur_data))
          .enter().append("g")
              .attr("class", "serie")
          .selectAll("rect")
          .data(function(d) { return d; })
          .enter().append("rect")
            .attr("x", function(d) { return xScale(d.data["Country"]); })
            .attr("y", function(d) { return yScale(d[1]); })
            .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
            .attr("width", xScale.bandwidth())
            .attr("fill", function(d) {
              cnt = cnt+1;
              if (d.data["Region"] == "Central and Eastern Europe"){
                return z_centralEU(Math.floor(cnt/len));
              }
              else if(d.data["Region"] == "Sub-Saharan Africa"){
                return z_subAfrica(Math.floor(cnt/len));
              }
              else if(d.data["Region"] == "Latin America and Caribbean"){
                return z_americas(Math.floor(cnt/len));
              }
              else if(d.data["Region"] == "Asia"){
                return z_asia(Math.floor(cnt/len));
              }
              else if(d.data["Region"] == "Middle East and Northern Africa"){
                return z_mid(Math.floor(cnt/len));
              }
              else{
                return z_westernEU(Math.floor(cnt/len));
              } })
      		  .on("mouseover", function(d){
      		  	var attr;
                div.style("left", (d3.event.pageX) + "px")
                   .style("top", (d3.event.pageY - 28) + "px");
      		  	for(var i=0; i < key.length; i++){
      		  		if(d.data[key[i]] <= (d[1]-d[0] + 0.005) && d.data[key[i]] >= (d[1]-d[0] - 0.005)){
      		  			attr = key[i];
      		  		}
      		  	}
      		  	div.html( d.data["Country"] + "<br/>" +  attr + "<br/>Score: " + d.data[attr].toFixed(2) + "<br/><br/>Overall Rank: "+ d.data["Rank"])  
                   .style("left", (d3.event.pageX) + "px")   
                   .style("top", (d3.event.pageY) + "px");  
               div.style("opacity",1.0);
      		   //drawLinePlt(d.data["Country"],attr);
      		  })

             .on("click", function(d){
                console.log(d.data["Country"]);
      
                var ooo = new Array();
                var oot = new Array();

                var con = d.data["Country"];
                var max = [0,0,0,0,0,0,0];

                 for(var i=0; i<3; i++){
                       var temp = [
                       {axis:"Dystopia",value:0},
                       {axis:"Economy",value:0},
                       {axis:"Family",value:0},
                       {axis:"Freedom",value:0},
                       {axis:"Generosity",value:0},
                       {axis:"Health",value:0},
                       {axis:"Trust",value:0},
                       ];
                  for(var j =0; j<data[i].length; j++){
    
                      if(data[i][j]["Dystopia"] > max[0]){
                        max[0] = data[i][j]["Dystopia"];
                      }

                      if(data[i][j]["Economy"] > max[1]){
                        max[1] = data[i][j]["Economy"];
                      }

                      if(data[i][j]["Family"] > max[2]){
                        max[2] = data[i][j]["Family"];
                      }
                      if(data[i][j]["Freedom"] > max[3]){
                        max[3] = data[i][j]["Freedom"];
                      }
                      if(data[i][j]["Generosity"] > max[4]){
                        max[4] = data[i][j]["Generosity"];
                        console.log("Generosity" + data[i][j]["Generosity"]);
                      }
                      if(data[i][j]["Health"] > max[5]){
                        max[5] = data[i][j]["Health"];
                      }
                       
                      if(data[i][j]["Trust"] > max[6]){
                        max[6] = data[i][j]["Trust"];
                      }
                    

                    if(data[i][j]["Country"] == con){
                      temp[0]["value"] = data[i][j]["Dystopia"];
                      temp[1]["value"] = data[i][j]["Economy"];
                      temp[2]["value"] = data[i][j]["Family"];
                      temp[3]["value"] = data[i][j]["Freedom"];
                      temp[4]["value"] = data[i][j]["Generosity"];
                      temp[5]["value"] = data[i][j]["Health"];
                      temp[6]["value"] = data[i][j]["Trust"];
                    }
                  }
                  ooo[i] = temp;
                  oot[i] = JSON.parse(JSON.stringify(temp));
                }

                 for(var j =0; j<3; j++){
                  for(var i =0; i<7; i++){
                    ooo[j][i]["value"] = ooo[j][i]["value"]/max[i];
                  }
                 }

                var mycfg = {
                  w: w,
                  h: h,
                  maxValue: 0.6,
                  levels: 6,
                  ExtraWidthX: 300
                }
                //Call function to draw the Radar chart
                //Will expect that data is in %'s
                document.getElementById("name").innerHTML = "    Radar chart for " + con;
                RadarChart.draw("#chart",ooo,oot,data,con,index,mycfg);

            })

      		  .on("mouseout", function(d){ div.style("opacity",0); });
}

function update(){
  data_copy = JSON.parse(JSON.stringify(cur_data));
  for (var i =0; i < data_copy.length; i++){
    data_copy[i]["Economy"] =  cur_data[i]["Economy"]* E_val/10;
    data_copy[i]["Health"] =  cur_data[i]["Health"]*H_val/10;
    data_copy[i]["Family"] =  cur_data[i]["Family"]*F_val/10;
    data_copy[i]["Trust"] =  cur_data[i]["Trust"]*T_val/10;
    data_copy[i]["Freedom"] =  cur_data[i]["Freedom"]*Fd_val/10;
    data_copy[i]["Generosity"] =  cur_data[i]["Generosity"]*G_val/10;
    data_copy[i]["Dystopia"] =  cur_data[i]["Dystopia"]*D_val/10;
    var temp = 0;
    for(var k=0; k<key.length; k++){
    	temp = temp + data_copy[i][key[k]];
    }
    data_copy[i]["total"] = temp;
  }
  if (ifsort==0){ 
    data_copy.sort(function (a, b) {
    return b.total-a.total;});
  }
  updatePoints(E_val,H_val,F_val,T_val,Fd_val,G_val,D_val);
  updateRank(data_copy)
}
function updateRank(data){
	var temp = JSON.parse(JSON.stringify(data));
	temp.sort(function(a,b){
  		return b.total-a.total;
  	})
	for(var i = 0; i< data.length; i++){
		data[i]["Rank"] = findIndex(temp,"Country", data[i]["Country"]);
	}
}
function findIndex(data, attr, val){
	for (var i = 0; i < data.length; i++){
		if(data[i][attr] === val){
			return i+1;
		}
	}
	return -1;
}
function selectVariable() {
  var e = document.getElementById("yAxisItem");
  s = e.options[e.selectedIndex].value;

  if(s == "y2015" ){  cur_data = data[0]; index = 0;}
  else if(s == "y2016" ){  cur_data = data[1]; index = 1;}
  else if(s == "y2017" ){  cur_data = data[2]; index = 2;};
  update();
}

function updatePoints(E_val,H_val,F_val,T_val,Fd_val,G_val,D_val) {
    xScale.domain(data_copy.map(function(d){return d["Country"];}));
    cnt = -1;
    d3.select(".axis").call(xAxis);
    var transition = d3.transition()
                       .duration(750)
                       .ease(d3.easeCubic);

    serie = svg.selectAll(".serie")
               .data(stack(data_copy))

    serie.selectAll("rect")
         .data(function(d) { return d; })
         .transition(transition)
         .attr("x", function(d) { return xScale(d.data["Country"]); })
         .attr("y", function(d) { return yScale(d[1]); })
         .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
         .attr("fill", function(d) {
         	cnt = cnt+1;
            if (d.data["Region"] == "Central and Eastern Europe"){
                return z_centralEU(Math.floor(cnt/len));
            }
            else if(d.data["Region"] == "Sub-Saharan Africa"){
                return z_subAfrica(Math.floor(cnt/len));
            }
            else if(d.data["Region"] == "Latin America and Caribbean"){
                return z_americas(Math.floor(cnt/len));
            }
            else if(d.data["Region"] == "Asia"){
                return z_asia(Math.floor(cnt/len));
            }
            else if(d.data["Region"] == "Middle East and Northern Africa"){
                return z_mid(Math.floor(cnt/len));
            }
            else{
                return z_westernEU(Math.floor(cnt/len));
            } })
        .attr("width", xScale.bandwidth());

}

function resize() {
  viewWidth = window.innerWidth;
  viewHeight = window.innerHeight;
}


var slider_E = document.getElementById("ERange");
var slider_H = document.getElementById("HRange");
var slider_F = document.getElementById("FRange");
var slider_T = document.getElementById("TRange");
var slider_Fd = document.getElementById("FdRange");
var slider_G = document.getElementById("GRange");
var slider_D = document.getElementById("DRange");

var output_E = document.getElementById("E_val");
var output_H = document.getElementById("H_val");
var output_F = document.getElementById("F_val");
var output_T = document.getElementById("T_val");
var output_Fd = document.getElementById("Fd_val");
var output_G = document.getElementById("G_val");
var output_D = document.getElementById("D_val");

// Display the default slider value
output_H.innerHTML = slider_H.value; 
output_E.innerHTML = slider_E.value;  
output_F.innerHTML = slider_F.value;
output_T.innerHTML = slider_T.value;
output_Fd.innerHTML = slider_Fd.value;
output_G.innerHTML = slider_G.value;
output_D.innerHTML = slider_D.value;

// Update the current slider value (each time you drag the slider handle)
slider_H.oninput = function() {
    output_H.innerHTML = this.value;
    H_val = this.value; }
slider_F.oninput = function() {
    output_F.innerHTML = this.value;
    F_val = this.value; }
slider_T.oninput = function() {
    output_T.innerHTML = this.value;
    T_val = this.value; }
slider_E.oninput = function() {
    output_E.innerHTML = this.value;
    E_val = this.value; }
slider_Fd.oninput = function() {
    output_Fd.innerHTML = this.value;
    Fd_val = this.value;  }
slider_G.oninput = function() {
    output_G.innerHTML = this.value;
    G_val = this.value; }
slider_D.oninput = function() {
    output_D.innerHTML = this.value;
    D_val = this.value; }

drawBarChart();

/*function  drawLinePlt(country, attr) {
    div.style("opacity",1.0);
    var yExtent = d3.extent(cur_data, function(d){return d[attr];});
    var value = [];
    for(var i=0; i<3; i++){
    	for(var j =0; j<data[i].length; j++){
    		if(data[i][j]["Country"] == country){
    			value.push(data[i][j][attr]);

    		}
    	}
    }
    var years = [new Date(2015,0,1), new Date(2016,0,1), new Date(2017,0,1)];
    var localData = [];
    for(var i =0; i<years.length; i++){localData.push({"year":years[i], "value":value[i]});}
    yScale2.domain([0,Math.floor(d3.max(yExtent)+1)]).nice();
     // svg2
    svg2.append("g")
       .attr("id", "xAxis2")
       .attr("transform", "translate(0," + height2 +")" )
       .call(xAxis2.ticks(d3.timeYear));

    svg2.append("g")
           .attr("id", "yAxis2")
           .call(yAxis2)
          .append("text")
           .attr("dy", "0.50em")
           .attr("x", 2)
           .attr("text-anchor", "start")
           .attr("fill", "#000")
           .text("Score");
    svg2.append("g")
         .attr("class","circles");

    svg2.selectAll(".circles")
          .selectAll(".dot")
          .data(localData)
    	   .enter().append("circle")
      		.attr("class", "dot")
      		.attr("cx", function(d){return xScale2(d.year);})
      		.attr("cy", function(d){return yScale2(d.value);})
      		.attr("r", 3);
  }*/
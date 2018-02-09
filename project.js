//Data attributes for use
var data = happiness_data.data;
var data_copy, 
    cur_data = data[0]; //year 2015 as default
var key = d3.keys(cur_data[0]).filter(function(d){return d!="Country" && d!="Score" && d!="Rank" && d!="Region"});
var regions = ["Western Europe", "Central and Eastern Europe", "Americas", "Asia", "Africa", "Middle East"];
var region2 = ["Western Europe", "Central and Eastern Europe", "Latin America and Caribbean", "Asia", "Sub-Saharan Africa", "Middle East and Northern Africa"];

//stacked bar chart
var viewWidth = 1180;
var viewHeight = 600;
var margin = {top: 20, right: 20, bottom: 100, left: 50},
    width = viewWidth - margin.left - margin.right,
    height = viewHeight - margin.top - margin.bottom;

var cnt, len = cur_data.length;
var len1;
var index = 0;
var color = ["#688597", "#a57aa3", "#9fbe62", "#cb952b", "#cc6969", "#7c6b78"];
var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);
var xAxis = d3.axisBottom().scale(xScale);
var yScale = d3.scaleLinear().range([height, 0]);
var yAxis = d3.axisLeft().scale(yScale);
var z_westernEU= d3.scaleOrdinal()
          .range(["#688597"," #466c82", "#19425f", "#0f2f4f", "#51588c", "#757aa3", "#90afdf"]);
var z_americas = d3.scaleOrdinal()
          .range(["#c5cd95", "#9fbe62", "#5f8218", "#436402", "#1e7215", "#5d9756", "#99c293"]);
var z_subAfrica = d3.scaleOrdinal()
          .range(["#ec9f9f", "#cc6969", "#8b1a1a", "#6b1212", "#88303a", "#cc9669", "#fcd2af"]);
var z_centralEU = d3.scaleOrdinal()
          .range(["#7f74a3", "#5e5083", "#3b2b70", "#291a5a", "#53136f", "#a57aa3", "#c0bcec"]);
var z_asia =  d3.scaleOrdinal()
          .range(["#ecbf68", "#cb952b", "#8b5c00", "#684510", "#907c28", "#d9c77b", "#eee2a9"]);
var z_mid= d3.scaleOrdinal()
          .range(["#7c6b78"," #5c5058", "#33333f", "#281c32", "#5d5c5e", "#847984", "#b8b3c7"]);
var weight = [10,10,10,10,10,10,10];
var ifsort=0;
var stack = d3.stack().keys(key);
var serie;
var svg = d3.select("svg")
            .attr("width", viewWidth)
            .attr("height", viewHeight)
            .append("g")
            .attr("transform", "translate(" + (margin.left )+ "," + (margin.top) + ")");

//scatter plot
var viewWidth2 = 550, viewHeight2 = 350;
var bottom = 40, left = 60,
    width2 = viewWidth2 - left - margin.right,
    height2 = viewHeight2 - margin.top - bottom;
var xScale2 = d3.scaleLinear().range([0, width2]);
var yScale2 = d3.scaleLinear().range([height2, 0]);
var xAxis2 = d3.axisBottom().scale(xScale2);
var yAxis2 = d3.axisLeft().scale(yScale2);
var xValue = "Economy";
var yValue = "Score";
var points;
var svg2 = d3.select("#scatterPlot")
             .append("div")
             .append("svg")
             .attr("width", viewWidth2)
             .attr("height", viewHeight2)
             .append("g")
             .attr("transform", "translate(" + left + "," + margin.top + ")");

//legend for stacked bar chart
var svgLegend = d3.select(".legend").append("svg")
            .attr("width", 500)
            .attr("height", 100);
var legend = svgLegend.selectAll(".legend1")
                .data(regions)
                .enter().append("g")
                .attr("transform", function (d, i) {
                  if(i < 3) {return "translate(0," + i*20 + ")"; }
                  else {return "translate(200," + (i-3)*20 + ")"; }
                });
var checked_country = [];
legend.append("rect")
      .attr("x","0")
      .attr('y',"0")
      .attr("width","15")
      .attr("height","15")
      .style("fill",function(d,i){return color[i]})
      .on("click",function(d,i){
        // legend.select("rect:nth-child("+1+")")
        //       .style("opacity",0.3);

        if (checked_country.includes(d)){
          checked_country = checked_country.filter(e=>e!==d);
          if(d=="Americas"){
            checked_country = checked_country.filter(e=>e!=="Latin America and Caribbean");
          }
          else if(d=="Africa"){
            checked_country = checked_country.filter(e=>e!=="Sub-Saharan Africa");
          }
          else if(d=="Middle East"){
            checked_country = checked_country.filter(e=>e!=="Middle East and Northern Africa");
          }
        }
        else{
          checked_country.push(d);
          if(d=="Americas"){
            checked_country.push("Latin America and Caribbean");
          }
          else if(d=="Africa"){
            checked_country.push("Sub-Saharan Africa");
          }
          else if(d=="Middle East"){
            checked_country.push("Middle East and Northern Africa");
          }
        }
        update();
      });

legend.append('text')
      .attr("x", 20)
      .attr("y", 10)
      .text(function (d) {return d; })
      .attr("class","legendFont")
      .style("text-anchor", "start")

//tooltips
var div = d3.select("body").append("div")
			      .attr("class","tooltip")
			      .style("opacity","0");
var tooltip= d3.select("body").append("div")
            .attr("class","tooltip_small")
            .style("opacity","0");

//radar chart
var w=200,
    h=200;

function drawBarChart(){
	  updateRank(cur_data);
	  var yExtent = d3.extent(cur_data, function(d){return d["Score"];});
    xScale.domain(cur_data.map(function(d){return d["Country"];}));
    yScale.domain([0,d3.max(yExtent)]).nice();

    svg.append("g")
       .attr("class", "axis")
       .attr("id", "xaxis")
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
       	   .attr("id","yaxis")
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
            .style("opacity",0.9)
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
      		  })

            .on("click", function(d){
      
                var ooo = new Array();
                var oot = new Array();
                var con = d.data["Country"];
                var max = [0,0,0,0,0,0,0];
                var max_v = [
                       {axis:"Dystopia",value:0},
                       {axis:"Economy",value:0},
                       {axis:"Family",value:0},
                       {axis:"Freedom",value:0},
                       {axis:"Generosity",value:0},
                       {axis:"Health",value:0},
                       {axis:"Trust",value:0},
                       ];

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
                        max_v[0]["value"] = data[i][j]["Dystopia"];
                      }

                      if(data[i][j]["Economy"] > max[1]){
                        max[1] = data[i][j]["Economy"];
                        max_v[1]["value"] = data[i][j]["Economy"];
                      }

                      if(data[i][j]["Family"] > max[2]){
                        max[2] = data[i][j]["Family"];
                        max_v[2]["value"] = data[i][j]["Family"];
                      }
                      if(data[i][j]["Freedom"] > max[3]){
                        max[3] = data[i][j]["Freedom"];
                        max_v[3]["value"] = data[i][j]["Freedom"];
                      }
                      if(data[i][j]["Generosity"] > max[4]){
                        max[4] = data[i][j]["Generosity"];
                        max_v[4]["value"] = data[i][j]["Generosity"];
                      }
                      if(data[i][j]["Health"] > max[5]){
                        max[5] = data[i][j]["Health"];
                        max_v[5]["value"] = data[i][j]["Health"];
                      }
                       
                      if(data[i][j]["Trust"] > max[6]){
                        max[6] = data[i][j]["Trust"];
                        max_v[6]["value"] = data[i][j]["Trust"];
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
                document.getElementById("name").innerHTML = "            Radar chart for " + con;
                RadarChart.draw("#chart",ooo,oot,data,con,index,max_v,mycfg);
            })

      		  .on("mouseout", function(d){ div.style("opacity",0); });
            update();
}

function update(){
  data_copy = JSON.parse(JSON.stringify(cur_data));
  for (var i =0; i < data_copy.length; i++){
    var temp = 0;
    for(var k = 0; k < key.length; k++){
      data_copy[i][key[k]] = cur_data[i][key[k]]*weight[k]/10;
    	temp = temp + data_copy[i][key[k]];
    }
    data_copy[i]["total"] = temp;
  }
  if (ifsort==0){ 
    data_copy.sort(function (a, b) {
    return b.total-a.total;});
  }
  // check selected data
  var l = 0;
  dlength = data_copy.length;
  for (var i =0; i < dlength; i++){
    if(checked_country.includes(data_copy[l]["Region"])){
      data_copy.splice(l,1);
    }else{ 
      l++;
    }}

  updatePoints();
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

function selectYear() {
  var e = document.getElementById("year");
  s = e.options[e.selectedIndex].value;
  if(s == "y2015" ){  cur_data = data[0]; index = 0;}
  else if(s == "y2016" ){  cur_data = data[1]; index = 1;}
  else if(s == "y2017" ){  cur_data = data[2]; index = 2;};
  update();
  updateScatter(xValue, yValue);
}

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
    updatePoints();
}

function updatePoints() {
    xScale.domain(data_copy.map(function(d){return d["Country"];}));
    yScale.domain([0, d3.max(d3.extent(data_copy, function(d){return d["total"];}))]).nice();
    cnt = -1;
    len1=0;

  var transition = d3.transition()
                     .duration(500)
                     .ease(d3.easeCubic);
  d3.select("#xaxis")
      .transition(transition)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor","end")
      .attr("dx","-.8em")
      .attr("dy",".15em")
      .attr("transform", "rotate(-50)")
      .attr("font-weight", "bold");
  d3.select("#yaxis")
      .transition(transition)
      .call(yAxis);

  serie = svg.selectAll(".serie")
               .data(stack(data_copy));

  var rects = serie.selectAll("rect");

        cnt= -1;
        rects.data(function(d) { len1 = Math.abs(d.length-len);return d; })
            .enter().append("rect")
            .attr("x", function(d) { return xScale(d.data["Country"]); })
            .attr("y", function(d) { return yScale(d[1]); })
            .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
            .attr("width", xScale.bandwidth())
            .attr("fill", function(d) {
              cnt = cnt+1;

              if (d.data["Region"] == "Central and Eastern Europe"){
                return z_centralEU(Math.floor(cnt/len1));
              }
              else if(d.data["Region"] == "Sub-Saharan Africa"){
                return z_subAfrica(Math.floor(cnt/len1));
              }
              else if(d.data["Region"] == "Latin America and Caribbean"){
                return z_americas(Math.floor(cnt/len1));
              }
              else if(d.data["Region"] == "Asia"){
                return z_asia(Math.floor(cnt/len1));
              }
              else if(d.data["Region"] == "Middle East and Northern Africa"){
                return z_mid(Math.floor(cnt/len1));
              }
              else{
                return z_westernEU(Math.floor(cnt/len1));
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
            })

              .on("click", function(d){
      
                var ooo = new Array();
                var oot = new Array();
                var con = d.data["Country"];
                var max = [0,0,0,0,0,0,0];
                var max_v = [
                       {axis:"Dystopia",value:0},
                       {axis:"Economy",value:0},
                       {axis:"Family",value:0},
                       {axis:"Freedom",value:0},
                       {axis:"Generosity",value:0},
                       {axis:"Health",value:0},
                       {axis:"Trust",value:0},
                       ];

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
                        max_v[0]["value"] = data[i][j]["Dystopia"];
                      }

                      if(data[i][j]["Economy"] > max[1]){
                        max[1] = data[i][j]["Economy"];
                        max_v[1]["value"] = data[i][j]["Economy"];
                      }

                      if(data[i][j]["Family"] > max[2]){
                        max[2] = data[i][j]["Family"];
                        max_v[2]["value"] = data[i][j]["Family"];
                      }
                      if(data[i][j]["Freedom"] > max[3]){
                        max[3] = data[i][j]["Freedom"];
                        max_v[3]["value"] = data[i][j]["Freedom"];
                      }
                      if(data[i][j]["Generosity"] > max[4]){
                        max[4] = data[i][j]["Generosity"];
                        max_v[4]["value"] = data[i][j]["Generosity"];
                      }
                      if(data[i][j]["Health"] > max[5]){
                        max[5] = data[i][j]["Health"];
                        max_v[5]["value"] = data[i][j]["Health"];
                      }
                       
                      if(data[i][j]["Trust"] > max[6]){
                        max[6] = data[i][j]["Trust"];
                        max_v[6]["value"] = data[i][j]["Trust"];
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
                document.getElementById("name").innerHTML = "            Radar chart for " + con;
                RadarChart.draw("#chart",ooo,oot,data,con,index,max_v,mycfg);
            })
            .on("mouseout", function(d){ div.style("opacity",0); });
   

        if(cnt!=-1){
        len = data_copy.length-len1;
        cnt = -1;  
        }
        else{
          cnt=-1
          len = data_copy.length;
        }
        
         rects.data(function(d) { return d; })
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

        rects.data(function(d) { len = data_copy.length;return d; }).exit().remove()

}

function drawScatterplot(v1, v2) {
  var xExtent = d3.extent(cur_data, function(d) { return d[v1]; });
  var yExtent = d3.extent(cur_data, function(d) { return d[v2]; });
  xScale2.domain([0, d3.max(xExtent)]).nice();
  yScale2.domain([0, d3.max(yExtent)]).nice();
  svg2.selectAll("g").remove();
  svg2.append("g")
      .attr("id", "xAxis2")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2)
  svg2.append("text")
      .attr("class", "label")
      .attr("id", "xlabel")
      .attr("transform", "translate(" + width2/2 +"," + (height2 + 30)+ ")")
      .style("text-anchor", "middle")
      .text(v1);

  svg2.append("g")
      .attr("id", "yAxis2")
      .attr("class", "axis")
      .call(yAxis2)
  svg2.append("text")
      .attr("class", "label")
      .attr("id", "ylabel")
      .attr("transform", "rotate(-90)")
      .attr("y", 15 - left)
      .attr("x", 0 - (height2/2))
      .attr("dy", ".71em")
      .style("text-anchor", "middle")
      .text(v2);
  svg2.append("g")     
      .attr("class", "grid")
      .attr("transform", "translate(0," + height2 + ")")
      .call(make_x_gridlines());
  svg2.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines());
  points = svg2.append("g")
      .attr("class", "plotArea")
    .selectAll(".dot")
      .data(cur_data)
    .enter().append("circle")
      .attr("r", 4)
      .attr("cx", function(d) { return xScale2(d[v1]); })
      .attr("cy", function(d) { return yScale2(d[v2]); })
      .style("fill", function(d) { 
        var i;
        for(i=0; i < regions.length; i++){
          if(d["Region"] == region2[i])
            break;
        }
        return color[i]; })
      .on("mouseover", function(d){
              tooltip.html( d["Country"])  
                     .style("left", (d3.event.pageX + 10) + "px")
                     .style("top", (d3.event.pageY - 20) + "px")
                     .style("opacity",1.0);
      })
      .on("mouseout", function(d){ tooltip.style("opacity",0); });
}

function make_x_gridlines() {   
    return d3.axisBottom(xScale2)
        .ticks(10)
        .tickSize(-height2)
        .tickFormat("");
}
function make_y_gridlines() {   
    return d3.axisLeft(yScale2)
        .ticks(10)
        .tickSize(-width2)
        .tickFormat("");
}


function updateScatter(v1, v2) {
  var xExtent = d3.extent(cur_data, function(d) { return d[v1]; });
  var yExtent = d3.extent(cur_data, function(d) { return d[v2]; });
  xScale2.domain([0, d3.max(xExtent)]).nice();
  yScale2.domain([0, d3.max(yExtent)]).nice();
  d3.select("#xAxis2").call(xAxis2);
  d3.select("#yAxis2").call(yAxis2);
  d3.select("#xlabel").text(v1);
  d3.select("#ylabel").text(v2);
  var transition = d3.transition()
                     .duration(750)
                     .ease(d3.easeCubic);

  svg2.selectAll("circle")
  .data(cur_data)
  .transition(transition)
    .attr("cx", function(d) { return xScale2(d[v1]); })
    .attr("cy", function(d) { return yScale2(d[v2]); })
    .style("fill", function(d) { 
        var i;
        for(i=0; i<regions.length; i++){
          if(d["Region"] == region2[i])
            break;
        }
        return color[i]; })
}

function selectVariable(id) {
  if(id == 0){
    var e = document.getElementById("xAxisItem");
    xValue = e.options[e.selectedIndex].value;
  }
  else if(id == 1){
    var e = document.getElementById("yAxisItem");
    yValue = e.options[e.selectedIndex].value;
  }
  updateScatter(xValue, yValue);
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
    weight[2] = this.value; }
slider_F.oninput = function() {
    output_F.innerHTML = this.value;
    weight[1] = this.value; }
slider_T.oninput = function() {
    output_T.innerHTML = this.value;
    weight[4] = this.value; }
slider_E.oninput = function() {
    output_E.innerHTML = this.value;
    weight[0] = this.value; }
slider_Fd.oninput = function() {
    output_Fd.innerHTML = this.value;
    weight[3] = this.value;  }
slider_G.oninput = function() {
    output_G.innerHTML = this.value;
    weight[5] = this.value; }
slider_D.oninput = function() {
    output_D.innerHTML = this.value;
    weight[6] = this.value; }

drawBarChart();
drawScatterplot(xValue, yValue);

document.getElementById("name").innerHTML = "    Example Radar Chart  ";
 var dummy = [[
         {axis:"Dystopia",value:3.60214},
         {axis:"Economy",value:1.870765686},
         {axis:"Family",value:1.610574007},
         {axis:"Freedom",value:0.66973},
         {axis:"Generosity",value:0.611704588},
         {axis:"Health",value:1.02525},
         {axis:"Trust",value:0.55191},
           ],
           [
         {axis:"Dystopia",value:2.44191},
         {axis:"Economy",value:1},
         {axis:"Family",value:1.03276},
         {axis:"Freedom",value:0.5},
         {axis:"Generosity",value:0.4},
         {axis:"Health",value:0.7},
         {axis:"Trust",value:0.7},
           ],
           [
         {axis:"Dystopia",value:1.597970247},
         {axis:"Economy",value:0.6},
         {axis:"Family",value:1.0},
         {axis:"Freedom",value:0.4},
         {axis:"Generosity",value:1},
         {axis:"Health",value:2},
         {axis:"Trust",value: 1},
           ],
           ];

  var con2 = "Zimbabwe";
  var cfg2 = {
                  w: w,
                  h: h,
                  maxValue: 0.6,
                  levels: 6,
                  ExtraWidthX: 300
                }
 RadarChart.draw("#chart",dummy,dummy,data,con2,index,[],cfg2);


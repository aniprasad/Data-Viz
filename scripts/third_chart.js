const margin3 = { top: 20, right: 30, bottom: 45, left: 50 };
const screenWidth3 = 0.9 * (window.innerWidth || document.documentElement.clientWidth);
const screenHeight3 = 0.55 * (window.innerHeight || document.documentElement.clientHeight);
const width3 = screenWidth3 - margin3.left - margin3.right;
const height3 = screenHeight3 - margin3.top - margin3.bottom;

const tooltip3 = d3.select("#tooltip3");

function createAnnotationArrow_ForChart3(x, y, description) {
  const arrow = svg3.append("g").attr("class", "annotation-arrow3");

  arrow
    .append("line")
    .attr("x1", x)
    .attr("x2", x)
    .attr("y1", y )
    .attr("y2", y + 60)
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  arrow
    .append("polygon")
    .attr("points", `${x - 5},${y + 50} ${x + 5},${y + 50} ${x},${y + 60}`) // Positive value to point downwards
    .attr("fill", "black")

  arrow
    .append("text")
    .attr("x", x)
    .attr("y", y + 75)
    .attr("text-anchor", "middle")
    .text(description)
    .style("font-size", "15px")
    .style("fill", "black");
}

// Append the svg object to the body of the page
const svg3 = d3
  .select("#chart3")
  .append("svg")
  .attr("width", width3 + margin3.left + margin3.right)
  .attr("height", height3 + margin3.top + margin3.bottom)
  .append("g")
  .attr("transform", `translate(${margin3.left + margin3.left},${margin3.top * 2})`);

// Define the dropdown
const dropdown3 = d3
  .select("#dropdown3")
  .append("select")
  .on("change", updateChart3);

let data3;

function updateFinishPositionValue(selectedSeason) {
  // Find the data for the selected season
  const selectedData = data3.find((d) => d.Season === selectedSeason);
  const season = selectedData.Season;

  var position = "";
  switch (season)
  {
  	case "2006-2007":
  	case "2007-2008":
  	case "2008-2009":
  	case "2010-2011":
  	case "2012-2013":
  		position = "First";
  		break;
  	case "2009-2010":
  	case "2011-2012":
  	case "2017-2018":
  		position = "Second";
  		break;
  	case "2013-2014":
  		position = "Seventh";
  		break;
  	case "2014-2015":
  		position = "Fourth";
  		break;
  	case "2015-2016":
  		position = "Fifth";
  		break;
  	case "2016-2017":
  		position = "Sixth";
  		break;
  	default:
  		position = "Unknown";
  		break;
  }

  // Update the text content of the "finishPositionValue" element
  d3.select("#finishPositionValue").text(position)
  	.style("color", "red")
}

  function updateChart3() {
    const selectedSeason = dropdown3.property("value");

    // Filter the data for the selected season
    const filteredData = data3.filter((d) => d.Season === selectedSeason);

    // List of categories
    const categories = filteredData.map((d) => d.Categories);

    // Clear the previous chart
    svg3.selectAll("*").remove();

    // Add X axis
    const x = d3.scaleBand()
    	.domain(categories)
    	.range([0, width3])
    	.padding(0.2);

    svg3
      .append("g")
      .attr("transform", `translate(0, ${height3})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear().domain([0, d3.max(filteredData, (d) => d.Value)]).range([height3, 0]);
    svg3.append("g").call(d3.axisLeft(y));

	  var selectedData = filteredData.find((d) => d.Season === "2013-2014" ||
	    d.Season === "2017-2018" || d.Season == "2014-2015" || d.Season == "2008-2009");

	  if (selectedData)
	  {
		selectedData = selectedData.Season;	  	
	  }

	  // selectedData = selectedData.Season;
	  if (selectedData && selectedSeason === "2013-2014") {
	    const xPosition = (width3 / 2) - 100; // Position arrow in the middle of the graph
	    const yPosition = (height3 / 2) - 85; // Position arrow in the middle of the graph
	    const description = "Poorer season defensively with David Moyes as manager"; // Replace this with your desired description
	    createAnnotationArrow_ForChart3(xPosition, yPosition, description);
	  } else if (selectedData && selectedSeason === "2014-2015") {
	    const xPosition = (width3 / 2) - 130; // Position arrow in the middle of the graph
	    const yPosition = (height3 / 2) - 85; // Position arrow in the middle of the graph
	    const description = "Good first season with Louis Van Gaal, but still poor defensively"; // Replace this with your desired description
	    createAnnotationArrow_ForChart3(xPosition, yPosition, description);
	  } else if (selectedData && selectedSeason === "2017-2018") {
	    const xPosition = (width3 / 2) - 150; // Position arrow in the middle of the graph
	    const yPosition = (height3 / 2) - 85; // Position arrow in the middle of the graph
	    const description = "Jose Mourinho, known as a typical defensive manager - Fewest goals conceded in last 10 years"; // Replace this with your desired description
	    createAnnotationArrow_ForChart3(xPosition, yPosition, description);
	  } else if (selectedData && selectedSeason === "2008-2009") {
	    const xPosition = (width3 / 2) - 150; // Position arrow in the middle of the graph
	    const yPosition = (height3 / 2) - 85; // Position arrow in the middle of the graph
	    const description = "Sir Alex Ferguson won the Premier league making it 3 champions in a row"; // Replace this with your desired description
	    createAnnotationArrow_ForChart3(xPosition, yPosition, description);
	  }
	  else {
	    svg3.selectAll(".annotation-arrow3").remove(); // Remove the arrow if no data matches the selected season or if it's not "2006-2007"
	  }

    // Add bars
    svg3
      .selectAll(".bar")
      .data(filteredData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.Categories))
      .attr("y", (d) => y(d.Value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height3 - y(d.Value))
      .attr("fill", (d, i) => d3.schemeCategory10[i % 10]) // Use d3.schemeCategory10 to get different colors for each bar
      .on("mouseover", function (event, d) {
        tooltip3.transition().duration(200).style("opacity", 0.9);
        tooltip3
          .html(`Value: ${d.Value}`)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        tooltip3.transition().duration(500).style("opacity", 0);
      });


	  // Call the function to update the finish position value
	  updateFinishPositionValue(selectedSeason);
  }


  // Parse the Data and populate the dropdown
  d3.csv("data/manchester_united_filtered_stats_transposed.csv").then(function (csvData) {
    // Store the parsed data
    data3 = csvData.map((d) => ({
      ...d,
      Value: parseInt(d.Value),
    }));

    const seasons = Array.from(new Set(data3.map((d) => d.Season)));

    // Add options to the dropdown
    dropdown3
      .selectAll("option")
      .data(seasons)
      .enter()
      .append("option")
      .text((d) => d);

    // Initial chart rendering
    updateChart3();
  });

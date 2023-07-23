// Set up the dimensions and margins of the graph
const margin2 = { top: 10, right: 30, bottom: 45, left: 50 };
const screenWidth2 = (window.innerWidth || document.documentElement.clientWidth);
const screenHeight2 = 0.52 * (window.innerHeight || document.documentElement.clientHeight);
const width2 = screenWidth2 - margin2.left - margin2.right;
const height2 = screenHeight2 - margin2.top - margin2.bottom;

const tooltip = d3.select("#tooltip");

function createAnnotationArrow(x, y, description) {
  const arrow = svg2.append("g").attr("class", "annotation-arrow");

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
    .attr("fill", "black");

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
const svg2 = d3
  .select("#chart2")
  .append("svg")
  .attr("width", width2 + margin2.left + margin2.right)
  .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
  .attr("transform", `translate(${margin2.left},${margin2.top})`);

// Define the dropdown
const dropdown = d3
  .select("#dropdown")
  .append("select")
  .on("change", updateChart);

// Define the data variable
let data;

// Function to update the chart based on the selected season
function updateChart() {
  const selectedSeason = dropdown.property("value");

  // Filter the data for the selected season
  const filteredData = data.filter((d) => d.season === selectedSeason);

  // List of subgroups = header of the csv files = soil condition here
  const subgroups = ["home_goals", "away_goals"];

  // List of groups = away teams = value of the 'away_team' column
  const groups = filteredData.map((d) => d.away_team);

  // Clear the previous chart
  svg2.selectAll("*").remove();

  // Add X axis
  const x = d3.scaleBand().domain(groups).range([0, width2]);
  svg2
    .append("g")
    .attr("transform", `translate(0, ${height2})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll(".tick text")
    .call(wrapText, x.bandwidth());

  // Function to wrap text based on width
  function wrapText(text, width) {
    text.each(function () {
      const words = d3.select(this).text().split(" ");
      const lineHeight = 1.0; // Adjust this value to control the line height

      d3.select(this).text(null);

      const wordContainers = d3.select(this).selectAll("tspan")
        .data(words)
        .enter()
        .append("tspan")
        .attr("x", 0)
        .attr("dy", (d, i) => i ? lineHeight + "em" : 10)
        .text((d) => d);
    });
  }

  // Add Y axis
  const y = d3.scaleLinear().domain([0, 11]).range([height2, 0]);
  svg2.append("g").call(d3.axisLeft(y));

  const selectedData = filteredData.find((d) => d.season === "2013-2014" || d.season === "2016-2017" ||
    d.season === "2017-2018" || d.season == "2014-2015" || d.season === "2015-2016" || d.season === "2010-2011");

  if (selectedData && selectedSeason === "2013-2014") {
    const xPosition = (width2 / 2); // Position arrow in the middle of the graph
    const yPosition = (height2 / 2) - 85; // Position arrow in the middle of the graph
    const description = "David Moyes appointed as manager resulting in poor home performance"; // Replace this with your desired description
    createAnnotationArrow(xPosition, yPosition, description);
  } else if (selectedData && selectedSeason === "2016-2017") {
    const xPosition = (width2 / 2); // Position arrow in the middle of the graph
    const yPosition = (height2 / 2) - 85; // Position arrow in the middle of the graph
    const description = "Jose Mourinho appointed as manager resulting in an average home season (but won 2 trophies!)"; // Replace this with your desired description
    createAnnotationArrow(xPosition, yPosition, description);
  } else if (selectedData && selectedSeason === "2014-2015") {
    const xPosition = (width2 / 2); // Position arrow in the middle of the graph
    const yPosition = (height2 / 2) - 85; // Position arrow in the middle of the graph
    const description = "Louis Van Gaal appointed manager - a great first season!"; // Replace this with your desired description
    createAnnotationArrow(xPosition, yPosition, description);
  } else if (selectedData && selectedSeason === "2015-2016") {
    const xPosition = (width2 / 2); // Position arrow in the middle of the graph
    const yPosition = (height2 / 2) - 85; // Position arrow in the middle of the graph
    const description = "Louis Van Gaal (2nd season) - downturn and eventually sacked despite winning a trophy"; // Replace this with your desired description
    createAnnotationArrow(xPosition, yPosition, description);
  } else if (selectedData && selectedSeason === "2017-2018") {
    const xPosition = (width2 / 2); // Position arrow in the middle of the graph
    const yPosition = (height2 / 2) - 85; // Position arrow in the middle of the graph
    const description = "Jose Mourinho - extremely strong second season! (Only 2 home losses the whole season)"; // Replace this with your desired description
    createAnnotationArrow(xPosition, yPosition, description);
  } else if (selectedData && selectedSeason === "2010-2011") {
    const xPosition = (width2 / 2); // Position arrow in the middle of the graph
    const yPosition = (height2 / 2) - 85; // Position arrow in the middle of the graph
    const description = "One of Sir Alex Ferguson's strongest seasons - Unbeaten at home";
    createAnnotationArrow(xPosition, yPosition, description);
  }
  else {
    svg2.selectAll(".annotation-arrow").remove(); // Remove the arrow if no data matches the selected season or if it's not "2006-2007"
  }

  // Color palette = one color per subgroup
  const color = d3.scaleOrdinal().domain(subgroups).range(["#e41a1c", "#377eb8"]);

  // Stack the data
  const stackedData = d3.stack().keys(subgroups)(filteredData);

svg2
  .append("g")
  .selectAll("g")
  .data(stackedData)
  .join("g")
  .attr("fill", (d) => color(d.key))
  .selectAll("rect")
  .data((d) => d)
  .join("rect")
  .attr("x", (d) => x(d.data.away_team))
  .attr("y", (d) => y(d[1]))
  .attr("height", (d) => y(d[0]) - y(d[1]))
  .attr("width", x.bandwidth())

svg2.selectAll("rect")
  .on("mouseover", function (event, d) {
    var result = d.data.result;
    if (result === 'D')
    {
      result = "Draw";
    }
    else if (result == 'W')
    {
      result = "Win";
    }
    else
    {
      result = "Loss";
    }
    const tooltipContent = `Home Goals Scored: ${d.data.home_goals}<br/>Away Goals Scored: ${d.data.away_goals}<br/>Result: ${result}`;

    tooltip
      .style("opacity", 0.9)
      .html(tooltipContent)
      .style("left", `${event.pageX - svg2.node().getBoundingClientRect().left}px`)
      .style("top", `${event.pageY - svg2.node().getBoundingClientRect().top}px`);
  })
  .on("mouseout", function () {
    tooltip.style("opacity", 0);
  });

// Add the result letter above the top of each stacked bar
svg2
  .append("g")
  .selectAll("text")
  .data(stackedData[1]) // Use the second layer of the stackedData for adding the text
  .join("text")
  .attr("x", (d) => x(d.data.away_team) + x.bandwidth() / 2)
  .attr("y", (d) => y(d[1]) - 5) // Adjust the value (-5) to control the vertical position of the text
  .attr("text-anchor", "middle")
  .style("font-size", "12px")
  .style("fill", "black")
  .text((d) => d.data.result);
}

// Parse the Data and populate the dropdown
d3.csv("data/manchester_united_filtered_results1.csv").then(function (csvData) {
  // Store the parsed data
  data = csvData.map((d) => ({
    ...d,
    home_goals: parseInt(d.home_goals),
    away_goals: parseInt(d.away_goals),
  }));

  const seasons = Array.from(new Set(data.map((d) => d.season)));

  // Add options to the dropdown
  dropdown
    .selectAll("option")
    .data(seasons)
    .enter()
    .append("option")
    .text((d) => d);

  // Initial chart rendering
  updateChart();

  // Create the legend
  const legend = d3.select("#legend");

  // Define the legend data
  const legendData = [
    { label: "Home Goals Scored", color: "#e41a1c" },
    { label: "Home Goals Conceded", color: "#377eb8" },
  ];

  // Add legend items
  const legendItems = legend
    .selectAll(".legend-item")
    .data(legendData)
    .enter()
    .append("div")
    .attr("class", "legend-item");

  // Add legend circles
  legendItems
    .append("svg")
    .attr("class", "legend-circle")
    .attr("width", 20)
    .attr("height", 20)
    .append("circle")
    .attr("cx", 10)
    .attr("cy", 10)
    .attr("r", 6)
    .style("fill", (d) => d.color);

  // Add legend labels
  legendItems
    .append("div")
    .attr("class", "legend-label")
    .text((d) => d.label);

  // Position legend circles and labels
  legendItems
    .style("display", "flex")
    .style("align-items", "center")
    .style("margin-bottom", "5px");

  legendItems.select(".legend-circle").style("margin-right", "5px");
});

// Set up the dimensions of the SVG canvas
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const screenWidth = 0.4 * (window.innerWidth || document.documentElement.clientWidth);
const screenHeight = 0.62 * (window.innerHeight || document.documentElement.clientHeight);
const width = screenWidth - margin.left - margin.right;
const height = screenHeight - margin.top - margin.bottom;

// Create the SVG canvas
const svg = d3
  .select("#chart")
  .attr("width", width)
  .attr("height", height)
  .style("border", "1px solid black")
  .style("display", "block")
  .style("margin", "auto")
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Top level data
const first_chart_data = [
  { data_index: 1, fact: "23 Managers", value: 30, color: "orange" },
  { data_index: 4, fact: "Founded 1878", value: 17, color: "black"},
  { data_index: 2, fact: "20 Premier League Titles", value: 75, color: "green" },
  { data_index: 0, fact: "69 Domestic Titles", value: 50, color: "steelblue" },
  { data_index: 3, fact: "2 Billion Spent", value: 30, color: "red"},
  { data_index: 5, fact: "First club to win treble", value: 50, color: "violet"},
];

const maxBubbleValue = d3.max(first_chart_data, (d) => d.value);

const radiusScale = d3.scaleSqrt().domain([0, maxBubbleValue]).range([10, 65]);
const xScale = d3.scaleBand().domain(first_chart_data.map((d) => d.fact)).range([50, width - 50]);
const yScale = d3.scaleLinear().domain([0, maxBubbleValue]).range([height - 50, 50]);

// Create the bubbles
const bubbles = svg
  .selectAll("circle")
  .data(first_chart_data)
  .enter()
  .append("circle")
  .attr("cx", (d) => xScale(d.fact) + xScale.bandwidth() / 2)
  .attr("cy", (d) => yScale(d.value))
  .attr("r", (d) => radiusScale(d.value))
  .attr("fill", (d) => d.color);

const labels = svg
  .selectAll("text")
  .data(first_chart_data)
  .enter()
  .append("text")
  .attr("x", (d) => xScale(d.fact) + xScale.bandwidth() / 2)
  .attr("y", (d) => yScale(d.value))
  .attr("text-anchor", "middle")
  .style("fill", "white")
  .style("font-size", "12px")
  .text((d) => d.fact);

labels.attr("transform", function (d) {
  const label = d3.select(this);
  const circle = d3.select(this.parentNode).select("circle");
  const dx = 0;
  const dy = label.node().getBBox().height / 2;
  return `translate(${dx}, ${dy})`;
});

// Add tooltips
bubbles
  .append("title")
  .text((d) => `${d.fact}: ${d.value}`);

const tooltip_chart1 = d3.select("#tooltipChart1");
bubbles.on("mouseover", function (event, d) {
  var fact = "";
  if (d.data_index == 5)
  {
    fact = "First club to win the English Premier League, the F.A cup and the UEFA Champions league all in the same season";
  } 
  else if (d.data_index == 0)
  {
    fact = "Most number of domestic championships won, more than any other English team";
  }
  else if (d.data_index == 4)
  {
    fact = "Founded in 1878 as Newton Heath LYR Football Club by Lancashire and Yorkshire Railway Services";
  }
  else if (d.data_index == 1)
  {
    fact = "Only 23 managers since its inception in 1878. The fewest amongst any English team. 2 of the longest serving managers covered about 60 years in total";
  } else if (d.data_index == 2)
  {
    fact = "More premier leagues than any other English football team";
  } else if (d.data_index == 3)
  {
    fact = "About 2 Billion pounds spent in acquiring players since 1878 (adjusted for inflation) - One of the most popular clubs for players to join";
  }

  tooltip_chart1
    .style("opacity", 0.9)
    .html(fact)
    .style("left", `${event.pageX + 10}px`)
    .style("top", `${event.pageY}px`);
});

bubbles.on("mouseout", function () {
  tooltip_chart1.style("opacity", 0);
});

async function lineChartstock() {
    // Create an empty container initially
    const visualContainer = d3.select("#visual").html("");
    const summaryContainer = d3.select("#stat").html("");

    try {
        // Fetch stock data from the API
        const response = await axios.get('https://bookish-giggle-r95v7799x5v2xw74-8000.app.github.dev/api/stock');
        const stockData = response.data["Time Series (5min)"];

        console.log("Stock Data:", stockData);

        // Extract dates and closing prices from the stock data
        const data = Object.entries(stockData).map(([date, values]) => ({
            date: new Date(date),
            close: parseFloat(values["4. close"])
        }));

        // Set up the line chart
        const margin = { top: 10, right: 30, bottom: 30, left: 60 };
        const width = 1000 - margin.left - margin.right;
        const height = 650 - margin.top - margin.bottom;

        const svg = d3.select("#visual")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Set up scales
        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.close)])
            .range([height, 0]);

        // Define the line
        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.close));

        // Draw the line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);

        // Draw x-axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Draw y-axis
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add labels
        svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Date");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left)
            .attr("x", -height / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Closing Price");
        const averageClose = d3.mean(data, d => d.close);
        const minClose = d3.min(data, d => d.close);
        const maxClose = d3.max(data, d => d.close);
        const stdDevClose = d3.deviation(data, d => d.close);

        console.log("Average Closing Price:", averageClose);
        console.log("Minimum Closing Price:", minClose);
        console.log("Maximum Closing Price:", maxClose);
        console.log("Standard Deviation:", stdDevClose);


        summaryContainer.html(`
            <h2>Average Closing Price: ${averageClose.toFixed(2)}</h2>
            <h2>Minimum Closing Price: ${minClose.toFixed(2)}</h2>
            <h2>Maximum Closing Price: ${maxClose.toFixed(2)}</h2>
            <h2>Standard Deviation: ${stdDevClose.toFixed(2)}</h2>
        `);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

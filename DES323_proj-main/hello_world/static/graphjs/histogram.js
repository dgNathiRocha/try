

async function drawVerticalHistogram() {
    // Create an empty container initially
    const visualContainer = d3.select("#visual").html("");

    try {
        // Fetch movie data from the API
        const response = await axios.get('https://bookish-giggle-r95v7799x5v2xw74-8000.app.github.dev/api/movie');
        const movieData = response.data.results;

        // Extract vote averages and movie titles from the movie data
        const data = movieData.map(movie => ({ voteAverage: movie.vote_average, title: movie.title }));

        // Set up the histogram
        const margin = { top: 10, right: 30, bottom: 200, left: 80 }; // Adjusted left margin
        const width = 1000 - margin.left - margin.right;
        const height = 650 - margin.top - margin.bottom;

        const svg = d3.select("#visual")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Set up scales
        const x = d3.scaleBand()
            .domain(data.map(d => d.title))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.voteAverage)])
            .range([height, 0]);

        // Draw bars
        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => x(d.title))
            .attr("y", d => y(d.voteAverage))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.voteAverage))
            .style("fill", "lightblue");

        // Draw x-axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-45)")
            .style("font-size", "7px")
            .style("font-weight", "bold");

        // Draw y-axis
        svg.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left)
            .attr("x", -margin.top)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("Vote Average");
        const averageVote = d3.mean(data, d => d.voteAverage);
        const minVote = d3.min(data, d => d.voteAverage);
        const maxVote = d3.max(data, d => d.voteAverage);
        const stdDevVote = d3.deviation(data, d => d.voteAverage);

        console.log("Average Vote:", averageVote);
        console.log("Minimum Vote:", minVote);
        console.log("Maximum Vote:", maxVote);
        console.log("Standard Deviation:", stdDevVote);

        const summaryContainer = d3.select("#stat").html("");

        summaryContainer.html(`
            <h1>Statistical Summary</h1>
            <p>Average Vote: ${averageVote.toFixed(2)}</p>
            <p>Minimum Vote: ${minVote.toFixed(2)}</p>
            <p>Maximum Vote: ${maxVote.toFixed(2)}</p>
            <p>Standard Deviation: ${stdDevVote.toFixed(2)}</p>
        `);
       
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

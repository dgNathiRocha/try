async function dotChart() {
    // Create an empty container initially
    const visualContainer = d3.select("#visual").html("");

    try {
        // Fetch movie data from the API
        const response = await axios.get('https://bookish-giggle-r95v7799x5v2xw74-8000.app.github.dev/api/movie');
        const movieData = response.data.results;

        // Extract relevant data for dot chart
        const data = movieData.map(movie => ({
            title: movie.title,
            voteAverage: movie.vote_average,
            releaseDate: new Date(movie.release_date)
        }));

        // Sort data by release date
        data.sort((a, b) => a.releaseDate - b.releaseDate);

        // Set up the dot chart
        const margin = { top: 30, right: 30, bottom: 30, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select("#visual")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Set up scales
        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.releaseDate))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.voteAverage)])
            .range([height, 0]);

        // Draw circles at each data point
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.releaseDate))
            .attr("cy", d => y(d.voteAverage))
            .attr("r", 4) // Radius of the circle
            .attr("fill", "steelblue");

        // Draw x-axis
        svg.append("g")
            .call(d3.axisBottom(x))
            .attr("transform", "translate(0," + height + ")")
            .append("text")
            .attr("x", width / 2)
            .attr("y", 25)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("Release Date");

        // Draw y-axis
        svg.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -40)
            .attr("x", -height / 2)
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

// Call the function to create the dot chart


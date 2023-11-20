async function PieChart() {
    // Create an empty container initially
    const visualContainer = d3.select("#visual").html("");

    try {
        // Fetch movie data from the API
        const response = await axios.get('https://bookish-giggle-r95v7799x5v2xw74-8000.app.github.dev/api/movie');
        const movieData = response.data.results;

        // Extract vote averages and movie titles from the movie data
        const data = movieData.map(movie => ({
            voteAverage: movie.vote_average,
            title: movie.title,
        }));

        // Calculate the total vote average
        const totalVoteAverage = data.reduce((acc, movie) => acc + movie.voteAverage, 0);

        // Calculate the percentage for each movie based on the total
        data.forEach(movie => {
            movie.percentage = (movie.voteAverage / totalVoteAverage) * 100;
        });

        // Set up the pie chart
        const width = 800;
        const height = 500;
        const radius = Math.min(width, height) / 2;

        const svg = d3
            .select("#visual")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("background-color", "#222222") // Add background color
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Set up the pie chart layout
        const pie = d3.pie().value((d) => d.percentage).sort(null);

        // Create the arcs for the pie chart
        const arc = d3.arc().innerRadius(0).outerRadius(radius);

        // Use a larger color scale with 20 colors
        const colorScale = d3.scaleOrdinal(d3.schemeCategory20);

        // Draw the pie chart
        const arcs = svg
            .selectAll("path")
            .data(pie(data))
            .enter()
            .append("path")
            .attr("d", arc)
            .style("fill", (d, i) => colorScale(i)); // Use different colors for each slice

        // Add percentage labels to each slice
        svg
            .selectAll("text")
            .data(pie(data))
            .enter()
            .append("text")
            .attr("transform", (d) => "translate(" + arc.centroid(d) + ")")
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text((d) => `${d.data.title}: ${d.data.percentage.toFixed(2)}%`);
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

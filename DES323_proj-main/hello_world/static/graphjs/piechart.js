async function fetchData() {
    const response = await fetch('https://bookish-giggle-r95v7799x5v2xw74-8000.app.github.dev/api/movie');
    const movieData = await response.json();
    const data = movieData.results.map(movie => ({
        voteAverage: movie.vote_average,
        title: movie.title,
        
    }));
    return data;
}

async function PieChart() {
    const visualContainer = d3.select("#visual").html("");
    try {
        const data = await fetchData();
        const totalVoteAverage = data.reduce((acc, movie) => acc + movie.voteAverage, 0);
        const width = 800;
        const height = 500;
        const radius = Math.min(width, height) / 2;
        const svg = visualContainer
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        const pie = d3.pie().value((d) => d.voteAverage).sort(null);
        const arc = d3.arc().innerRadius(0).outerRadius(radius);
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        const arcs = svg
            .selectAll("path")
            .data(pie(data))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => colorScale(i));

        // Calculate statistics
        const voteAverages = data.map(d => d.voteAverage);
        const medianVote = d3.median(voteAverages);
        const modeVote = d3.mode(voteAverages);
        const minVote = d3.min(voteAverages);
        const maxVote = d3.max(voteAverages);
        const stdDevVote = d3.deviation(voteAverages);

        console.log("Median Vote:", medianVote);
        console.log("Mode Vote:", modeVote);
        console.log("Minimum Vote:", minVote);
        console.log("Maximum Vote:", maxVote);
        console.log("Standard Deviation:", stdDevVote);

        summaryContainer.html(`
            <h1>Statistical Summary</h1>
            <p>Median Vote: ${medianVote.toFixed(2)}</p>
            <p>Mode Vote: ${modeVote[0]}</p>
            <p>Minimum Vote: ${minVote.toFixed(2)}</p>
            <p>Maximum Vote: ${maxVote.toFixed(2)}</p>
            <p>Standard Deviation: ${stdDevVote.toFixed(2)}</p>
        `);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

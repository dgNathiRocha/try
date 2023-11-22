async function fetchData() {
    const response = await fetch('https://bookish-giggle-r95v7799x5v2xw74-8000.app.github.dev/api/movie');
    const movieData = await response.json();
    const data = movieData.results.map(movie => ({
        popularity: movie.popularity,
        title: movie.title,
    }));
    return data;
}

async function trypie() {
    const visualContainer = d3.select("#visual").html("");
    try {
        const data = await fetchData();
        const totalPopularity = data.reduce((acc, movie) => acc + movie.popularity, 0);
        const width = 800;
        const height = 500;
        const radius = Math.min(width, height) / 2;
        const svg = visualContainer
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        const pie = d3.pie().value((d) => d.popularity).sort(null);
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
        const popularities = data.map(d => d.popularity);
        const medianPopularity = d3.median(popularities);
        const modePopularity = d3.mode(popularities);
        const minPopularity = d3.min(popularities);
        const maxPopularity = d3.max(popularities);
        const stdDevPopularity = d3.deviation(popularities);

        console.log("Median Popularity:", medianPopularity);
        console.log("Mode Popularity:", modePopularity);
        console.log("Minimum Popularity:", minPopularity);
        console.log("Maximum Popularity:", maxPopularity);
        console.log("Standard Deviation:", stdDevPopularity);

        summaryContainer.html(`
            <h1>Statistical Summary</h1>
            <p>Median Popularity: ${medianPopularity.toFixed(2)}</p>
            <p>Mode Popularity: ${modePopularity[0]}</p>
            <p>Minimum Popularity: ${minPopularity.toFixed(2)}</p>
            <p>Maximum Popularity: ${maxPopularity.toFixed(2)}</p>
            <p>Standard Deviation: ${stdDevPopularity.toFixed(2)}</p>
        `);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

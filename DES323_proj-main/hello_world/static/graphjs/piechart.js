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
      const pie = d3.pie().value((d) => d.voteAverage).sort(null);

      // Create the arcs for the pie chart
      const arc = d3.arc().innerRadius(0).outerRadius(radius);

      // Use a larger color scale with 20 colors
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

      // Draw the pie chart
      svg
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
          .attr("text-anchor", "middle")
          .attr("dy", "0.35em") // Adjust label position as needed
          .attr("transform", (d) => "translate(" + arc.centroid(d) + ")")
          .text((d) => `${d.data.percentage.toFixed(2)}%`);
  } catch (error) {
      console.error("Error fetching data:", error);
  }
}

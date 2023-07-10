import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import "../../pages/PlantDetails/PlantDetails.css";

const HarvestTracker = ({ plant, token }) => {
  const [averageRating, setAverageRating] = useState(null);
  const [harvestRatings, setHarvestRatings] = useState([]);

  const fetchHarvestRatings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/harvests?plant_id=${plant.id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const ratings = response.data
        .filter((harvest) => harvest.plant_id === plant.id)
        .map((harvest) => [new Date(harvest.task_completed), harvest.rating]);

      setHarvestRatings(ratings);

      if (ratings.length > 0) {
        const sum = ratings.reduce((a, b) => a + b[1], 0);
        const averageRating = sum / ratings.length;
        setAverageRating(averageRating.toFixed(2));
      } else {
        setAverageRating("No Harvests");
      }
    } catch (error) {
      setAverageRating("Error calculating average rating");
    }
  };

  useEffect(() => {
    fetchHarvestRatings();
  }, [plant, token]);

  return (
    <div className="harvest-info">
      <div>Average Rating: {averageRating}</div>
      {harvestRatings.length > 0 ? (
        <Chart
          chartType="LineChart"
          data={[["Date", "Rating"], ...harvestRatings]}
          width="100%"
          height="400px"
          options={{
            legend: { position: "bottom" },
            curveType: "none",
          }}
          legendToggle
        />
      ) : (
        <p>No harvest ratings found.</p>
      )}
    </div>
  );
};

export default HarvestTracker;
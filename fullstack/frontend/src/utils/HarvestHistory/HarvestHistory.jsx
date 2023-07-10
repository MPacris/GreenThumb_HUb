import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../pages/PlantDetails/PlantDetails.css";
import HarvestTracker from "../HarvestTracker/HarvestTracker";

const HarvestHistory = ({ plant, token }) => {
  const [harvests, setHarvests] = useState([]);

  const fetchHarvests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/harvests?plant_id=${plant.id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setHarvests(response.data);
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    fetchHarvests();
  }, [plant, token]);

  return (
    <div className="container-fluid">
      <div className="bottom-container">
        <div className="harvest-info">
          <h5>Harvest History:</h5>
          <table>
            <thead>
              <tr>
                <th>Task Completed</th>
                <th>Rating</th>    
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {harvests
                .filter((harvest) => harvest.plant_id === plant.id)
                .map((harvest) => (
                  <tr key={harvest.id}>
                    <td>{harvest.task_completed}</td>
                    <td>{harvest.rating}</td>   
                    <td>{harvest.notes}</td>
             
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HarvestHistory;
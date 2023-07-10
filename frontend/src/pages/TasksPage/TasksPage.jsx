import React, { useEffect, useState, useRef } from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import axios from "axios";
import "./TasksPage.css";

const TasksPage = () => {
  const [user, token] = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filterTaskCompleted, setFilterTaskCompleted] = useState("");
  const [filterPlantType, setFilterPlantType] = useState("");
  const [filterTaskType, setFilterTaskType] = useState("");
  const [uniqueTaskTypes, setUniqueTaskTypes] = useState([]);
  const [uniqueTaskCompletedDates, setUniqueTaskCompletedDates] = useState([]);
  const [uniquePlantTypes, setUniquePlantTypes] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tasks", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const taskData = response.data;

        const plantIds = taskData.map((task) => task.plant_id);
        const plantResponse = await axios.get(
          `http://localhost:5000/api/plants?ids=${plantIds.join(",")}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const plants = plantResponse.data;

        const updatedTasks = taskData.map((task) => {
          const plant = plants.find((plant) => plant.id === task.plant_id);
          return {
            ...task,
            plant_type: plant ? plant.type : "",
          };
        });

        setTasks(updatedTasks);

        const plantTypes = [...new Set(updatedTasks.map((task) => task.plant_type))];
        setUniquePlantTypes(plantTypes);
      } catch (error) {
        console.log(error.response.data);
      }
    };

    fetchTasks();
  }, [token]);

  useEffect(() => {
    const types = [...new Set(tasks.map((task) => task.task_type))];
    setUniqueTaskTypes(types);

    const dates = [...new Set(tasks.map((task) => task.task_completed))];
    setUniqueTaskCompletedDates(dates);
  }, [tasks]);

  const filteredTasks = tasks.filter((task) => {

    if (filterPlantType && filterPlantType !== "empty" && task.plant_type !== filterPlantType) {
      return false;
    }
    if (filterTaskType && filterTaskType !== "empty" && task.task_type !== filterTaskType) {
      return false;
    }
    return true;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortBy === "taskType") {
      const comparison = a.task_type.localeCompare(b.task_type);
      return sortOrder === "asc" ? comparison : -comparison;
    } else if (sortBy === "taskCompleted") {
      const dateA = new Date(a.task_completed);
      const dateB = new Date(b.task_completed);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  useEffect(() => {

    const tableHeaders = tableRef.current.querySelectorAll("th");
    tableHeaders.forEach((header) => {
      const cellWidth = header.offsetWidth;
      header.style.width = `${cellWidth}px`;
    });
  }, [sortedTasks]);

return (
  <div className="page-container">
    <h1 className="welcome-message">My Tasks</h1>
    <div className="filters">
      <div className="label-container">
        <label htmlFor="plantType">Plant Type:</label>
        <select
          id="plantType"
          value={filterPlantType}
          onChange={(e) => setFilterPlantType(e.target.value)}
          className="select-container"
        >
          <option value="">All</option>
          <option value="empty">Empty</option>
          {uniquePlantTypes.map((plantType, index) => (
            <option key={index} value={plantType}>
              {plantType}
            </option>
          ))}
        </select>
      </div>

      <div className="label-container">
        <label htmlFor="taskType">Task Type:</label>
        <select
          id="taskType"
          value={filterTaskType}
          onChange={(e) => setFilterTaskType(e.target.value)}
          className="select-container"
        >
          <option value="">All</option>
          <option value="empty">Empty</option>
          {uniqueTaskTypes.map((taskType, index) => (
            <option key={index} value={taskType}>
              {taskType}
            </option>
          ))}
        </select>
      </div>

      <div className="label-container">
        <label htmlFor="sortBy">Sort By:</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select-container"
        >
          <option value="">None</option>
          <option value="taskType">Task Type</option>
          <option value="taskCompleted">Task Completed</option>
        </select>
      </div>

      <div className="label-container">
        <label htmlFor="sortOrder">Sort Order:</label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="select-container"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>

    <div className="table-container" ref={tableRef}>
        <table>
          <thead>
            <tr>
              <th>Task Type</th>
              <th>Task Scheduled</th>
              <th>Task Completed</th>    
              <th>Plant ID</th>
              <th>Plant Type</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.map((task) => (
              <tr
                key={task.id}
                className={task.task_completed ? "" : "task-incomplete"}
              >
                <td>{task.task_type}</td>
                <td>{task.task_scheduled}</td>
                <td>{task.task_completed}</td>        
                <td>{task.plant_id}</td>
                <td>{task.plant_type}</td>
                <td>
                  <Link to={`/task-details/${task.id}`}>View Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default TasksPage;
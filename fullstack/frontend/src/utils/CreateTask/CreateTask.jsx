import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./CreateTask.css";

const defaultValues = {
  plant_id: "",
  task_type: "",
  task_scheduled: "",
  task_completed: "",
  user_id: "",
};

const taskTypeOptions = [
  "add fertilizer",
  "till soil",
  "plant seed",
  "water",
  "weed",
  "harvest",
  "final harvest",
];

const CreateTask = () => {
  const [user, token] = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultValues);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const plantIdFromQuery = searchParams.get("plant_id");
    setFormData((prevData) => ({
      ...prevData,
      plant_id: plantIdFromQuery,
    }));
  }, [location.search]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function postNewTask() {
    try {
      let existingTasks = await axios.get("http://localhost:8000/api/tasks", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      let response = await axios.post(
        "http://localhost:8000/api/tasks",
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setFormData(defaultValues);
      navigate("/tasks");
    } catch (error) {
      console.log(error.response.data);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      formData.user_id === "" ||
      formData.task_type === "" ||
      formData.task_scheduled === "" 
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    if (formData.task_completed === "") {
      delete formData.task_completed;
    }

    postNewTask();
  };

  return (
    <div className="create-task-container">
      <div className="row">
        <div className="col-4"></div>
        <div className="col-4">
          <div className="middle-container">
            <h2>Create Task</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="plant_id">Plant ID:</label>
                <input
                  className="form-control"
                  type="number"
                  id="plant_id"
                  name="plant_id"
                  value={formData.plant_id}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task_type">Task Type:</label>
                <select
                  className="form-select"
                  id="task_type"
                  name="task_type"
                  value={formData.task_type}
                  onChange={handleInputChange}
                >
                  <option value="">Select a task type</option>
                  {taskTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task_scheduled">Task Scheduled:</label>
                <input
                  className="form-control"
                  type="date"
                  id="task_scheduled"
                  name="task_scheduled"
                  value={formData.task_scheduled}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task_completed">
                  Task Completed:
                </label>
                <input
                  className="form-control"
                  type="date"
                  id="task_completed"
                  name="task_completed"
                  value={formData.task_completed}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="user_id">User ID:</label>
                <input
                  className="form-control"
                  type="number"
                  id="user_id"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                />
              </div>

              <button className="submit-button" type="submit">Create Task</button>
            </form>

            <div>
              <Link to="/tasks">Go To All Tasks</Link>
            </div>
          </div>
        </div>
        <div className="col-4"></div>
      </div>
    </div>
  );
};

export default CreateTask;
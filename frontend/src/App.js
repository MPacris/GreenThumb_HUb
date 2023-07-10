// General Imports
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Pages Imports
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import GardensPage from "./pages/GardensPage/GardensPage";
import GardenDetails from "./pages/GardenDetails/GardenDetails";
import PlantsPage from "./pages/PlantsPage/PlantsPage";
import PlantDetails from "./pages/PlantDetails/PlantDetails"
import TaskDetails from "./pages/TaskDetails/TaskDetails";
import TasksPage from "./pages/TasksPage/TasksPage";
import HarvestsPage from "./pages/HarvestsPage/HarvestsPage";
import HarvestDetails from "./pages/HarvestDetails/HarvestDetails";
import UserGardens from "./pages/UserGardens/UserGardens";
import WeatherPage from "./pages/WeatherPage/WeatherPage";


// Component Imports
import Navbar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";

// Util Imports
import PrivateRoute from "./utils/PrivateRoute";
import AddGarden from "./utils/AddGarden/AddGarden";
import AddPlant from "./utils/AddPlant/AddPlant";
import CreateTask from "./utils/CreateTask/CreateTask";
import CreateHarvest from "./utils/CreateHarvest/CreateHarvest";
import AddUserGarden from "./utils/AddUserGarden/AddUserGarden";
import EditTaskDetails from "./utils/EditTaskDetails/EditTaskDetails";




function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/gardens" element={<GardensPage/>} />
        <Route path="/add-garden" element={<AddGarden/>} />
        <Route path="/garden-details/:garden_id" element={<GardenDetails />} />
        <Route path="/add-plant" element={<AddPlant/>}/>
        <Route path="/plant-details/:plant_id" element={<PlantDetails />} />
        <Route path="/plants" element={<PlantsPage />} /> 
        <Route path="/tasks" element={<TasksPage/>} />
        <Route path="/task-details/:task_id" element={<TaskDetails/>} />
        <Route path="/create-task" element={<CreateTask/>} />
        <Route path="/harvests" element={<HarvestsPage/>}/>
        <Route path="/harvest-details/:harvest_id" element={<HarvestDetails/>}/>
        <Route path="/create-harvest" element={<CreateHarvest/>}/>
        <Route path="/add-user-garden" element={<AddUserGarden/>}/>
        <Route path="/user-gardens" element={<UserGardens/>}/>
        <Route path="/weather-page" element={<WeatherPage/>}/>
        <Route path="/edit-task-details/:task_id" element={<EditTaskDetails />} />



      </Routes>
      <Footer />
    </div>
  );
}

export default App;

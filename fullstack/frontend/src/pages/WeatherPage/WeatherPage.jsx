import React, { useState } from "react";
import axios from "axios";
import "./WeatherPage.css"

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState({
    forecast: null,
    history: null,
  });
  const [zipCode, setZipCode] = useState("70001");
  const [forecastStartDate, setForecastStartDate] = useState("");
  const [forecastEndDate, setForecastEndDate] = useState("");
  const [historyStartDate, setHistoryStartDate] = useState("");
  const [historyEndDate, setHistoryEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForecastSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const forecastUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${zipCode}/${forecastStartDate}/${forecastEndDate}?key=UEGXMTVM25SR2T4KPDCNQ8PSD&include=days&elements=datetime,tempmax,tempmin,precipprob,uvindex`;

    try {
      const response = await axios.get(forecastUrl);
      setWeatherData({ ...weatherData, forecast: response.data });
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    }

    setIsLoading(false);
  };

  const handleHistorySubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const historyUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${zipCode}/${historyStartDate}/${historyEndDate}?key=UEGXMTVM25SR2T4KPDCNQ8PSD&include=days&elements=datetime,tempmax,tempmin,precip,uvindex`;

    try {
      const response = await axios.get(historyUrl);
      setWeatherData({ ...weatherData, history: response.data });
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }

    setIsLoading(false);
  };

  const forecastDaysData = weatherData.forecast?.days || [];
  const historyDaysData = weatherData.history?.days || [];

  return (
    <div className="container">
      <h1 className="welcome-message">Weather Tracker</h1>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleForecastSubmit} className="mb-3">
            <div className="form-group">
              <label className="form-label" htmlFor="zipCode">
                Zip Code:
              </label>
              <input
                type="text"
                id="zipCode"
                className="form-control"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="forecastStartDate">
                Forecast Start Date:
              </label>
              <input
                type="date"
                id="forecastStartDate"
                className="form-control"
                value={forecastStartDate}
                onChange={(e) => setForecastStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="forecastEndDate">
                Forecast End Date:
              </label>
              <input
                type="date"
                id="forecastEndDate"
                className="form-control"
                value={forecastEndDate}
                onChange={(e) => setForecastEndDate(e.target.value)}
              />
            </div>
            <button type="submit" className="submit-button">
              Get Forecast
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <form onSubmit={handleHistorySubmit} className="mb-3">
            <div className="form-group">
              <label className="form-label" htmlFor="zipCode">
                Zip Code:
              </label>
              <input
                type="text"
                id="zipCode"
                className="form-control"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="historyStartDate">
                History Start Date:
              </label>
              <input
                type="date"
                id="historyStartDate"
                className="form-control"
                value={historyStartDate}
                onChange={(e) => setHistoryStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="historyEndDate">
                History End Date:
              </label>
              <input
                type="date"
                id="historyEndDate"
                className="form-control"
                value={historyEndDate}
                onChange={(e) => setHistoryEndDate(e.target.value)}
              />
            </div>
            <button type="submit" className="submit-button">
              Get Historical Data
            </button>
          </form>
        </div>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Forecast</h2>
              </div>
              <div className="card-body">
                <div className="row">
                  {forecastDaysData.map((day, index) => (
                    <div className="col-md-4" key={index}>
                      <div className="card mb-3">
                        <div className="card-header">{day.datetime}</div>
                        <div className="card-body">
                          <p className="card-text">
                            Chance of Rain: {day.precipprob}%
                          </p>
                          <p className="card-text">
                            Temperature Max: {day.tempmax}°F
                          </p>
                          <p className="card-text">
                            Temperature Min: {day.tempmin}°F
                          </p>
                          <p className="card-text">UV: {day.uvindex}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Historical Data</h2>
              </div>
              <div className="card-body">
                <div className="row">
                  {historyDaysData.map((day, index) => (
                    <div className="col-md-4" key={index}>
                      <div className="card mb-3">
                        <div className="card-header">{day.datetime}</div>
                        <div className="card-body">
                          <p className="card-text">
                            Total Precipitation: {day.precip} in
                          </p>
                          <p className="card-text">
                            Temperature Max: {day.tempmax}°F
                          </p>
                          <p className="card-text">
                            Temperature Min: {day.tempmin}°F
                          </p>
                          <p className="card-text">UV: {day.uvindex}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;
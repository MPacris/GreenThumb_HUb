import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import "./AddGarden.css"

const defaultValues = {
  name: '',
  notes: ''
};

const AddGarden = () => {
  const [user, token] = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultValues);
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function postNewGarden() {
    try {
      let existingGardens = await axios.get('http://localhost:5000/api/gardens', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      let isDuplicate = existingGardens.data.some((garden) => garden.name === formData.name);
      if (isDuplicate) {
        setError('Garden name must be unique.');
        return;
      }

      let response = await axios.post('http://localhost:5000/api/gardens', formData, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      setFormData(defaultValues);

      navigate('/');
      window.location.reload();
    } catch (error) {
      console.log(error.response.data);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    postNewGarden();
  };

  return (
    <div className="add-garden-container">
      <h1 className="add-garden-heading">Add a New Garden</h1>

      <div className="add-garden-form">
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label element="name" className="form-label">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label element="notes" className="form-label">
              Notes:
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="form-textarea"
            />
          </div>

          <button type="submit" className="add-garden-button">
            Add Garden
          </button>
        </form>
        <Link to="/" className="go-to-gardens-link">
           Home
        </Link>
      </div>
    </div>
  );
};

export default AddGarden;
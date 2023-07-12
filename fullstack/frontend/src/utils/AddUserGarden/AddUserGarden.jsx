import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function AddUserGarden() {
  const [username, setUsername] = useState('');
  const [gardenId, setGardenId] = useState('');
  const [gardens, setGardens] = useState([]);
  const [user, token] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGardens = async () => {
      try {
        const response = await axios.get('http://18.117.255.133:8000/api/gardens', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });

        setGardens(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGardens();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://18.117.255.133:8000/api/user_gardens',
        {
          username,
          garden_id: gardenId,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );

      console.log(response.data);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Add User Garden</h1>
      <form onSubmit={handleSubmit}>
        <label element="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label element="gardenId">Garden ID:</label>
        <select
          id="gardenId"
          name="gardenId"
          value={gardenId}
          onChange={(e) => setGardenId(e.target.value)}
          required
        >
          <option value="">Select a garden</option>
          {gardens.map((garden) => (
            <option key={garden.id} value={garden.id}>
              {garden.name}
            </option>
          ))}
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddUserGarden;
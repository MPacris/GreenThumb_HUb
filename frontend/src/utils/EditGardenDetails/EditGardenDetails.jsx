import React, { useState } from "react";
import axios from "axios";

const EditGardenDetails = ({ garden, token, handleSave }) => {
  const [newName, setNewName] = useState(garden.name);
  const [newNotes, setNewNotes] = useState(garden.notes);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNotesChange = (e) => {
    setNewNotes(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        name: newName,
        notes: newNotes,
      };

      await axios.put(`http://localhost:8000/api/gardens/${garden.id}`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      handleSave(data);
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form className="form-group" onSubmit={handleSubmit}>
      <label className="form-label">
        Name:
        <input type="text" value={newName} onChange={handleNameChange} className="form-control" />
      </label>
      <label className="form-label">
        Notes:
        <textarea value={newNotes} type="text" onChange={handleNotesChange} className="form-control" />
      </label>
      <button type="submit" className="submit-button">Save</button>
    </form>
  );
};

export default EditGardenDetails;
import React, { useState } from "react";
import axios from "axios";
import "./EditHarvestDetails.css"

const EditHarvestDetails = ({ harvest, token, handleSave }) => {
  const [newRating, setNewRating] = useState(harvest.rating);
  const [newNotes, setNewNotes] = useState(harvest.notes);
  const [editCompleted, setEditCompleted] = useState(false);

  const handleRatingChange = (e) => {
    setNewRating(e.target.value);
  };

  const handleNotesChange = (e) => {
    setNewNotes(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        rating: newRating,
        notes: newNotes,
      };

      await axios.put(`http://18.117.255.133:8000/api/harvests/${harvest.id}`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      handleSave(data);
      setEditCompleted(true);
    } catch (error) {
      // Need to put an error message here
    }
  };

  return (
    <div className="edit-harvest-information">
    <form onSubmit={handleSubmit} className="section bg-light p-3 mb-4">
      {editCompleted && <div className="alert alert-success">Edit completed successfully!</div>}
      <h3 className="mb-3">Edit Harvest Details:</h3>
      <div className="form-group row">
        <label element="rating" className="form-label">Rating:</label>
        <div className="col-sm-10">
          <input type="text" id="rating" className="form-control" value={newRating} onChange={handleRatingChange} />
        </div>
      </div>
      <div className="form-group row">
        <label element="notes" className="form-label">Notes:</label>
        <div className="col-sm-10">
          <input type="text" id="notes" className="form-control" value={newNotes} onChange={handleNotesChange} />
        </div>
      </div>
      <button type="submit" className="submit-button">Save</button>
    </form>
    </div>
  );
};

export default EditHarvestDetails;
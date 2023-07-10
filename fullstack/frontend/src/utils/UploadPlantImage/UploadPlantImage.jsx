import React, { useState } from "react";
import axios from "axios";

const UploadPlantImage = ({ plant, token, handleImageUpload }) => {
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("image_url", imageFile);

      await axios.post(
        `http://localhost:5000/api/plantImage/${plant.id}`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      handleImageUpload();
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form className="form-group" onSubmit={handleSubmit}>
      <label className="form-label">
        Upload Image:
        <input className="form-control" type="file" onChange={handleFileChange} />
      </label>
      <button className="submit-button" type="submit">Upload</button>
    </form>
  );
};

export default UploadPlantImage;
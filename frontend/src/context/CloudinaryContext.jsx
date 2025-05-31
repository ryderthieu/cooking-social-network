import React, { createContext, useContext } from "react";
import axios from "axios";

const CloudinaryContext = createContext();

export const CloudinaryProvider = ({ children }) => {
  const uploadImage = async (file, folder = "general") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "cooking_preset"); // Tên preset đã tạo
    formData.append("folder", folder);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dfaq5hbmx/image/upload`,
      formData
    );
    return response.data; // chứa url, public_id, ...
  };

  return (
    <CloudinaryContext.Provider value={{ uploadImage }}>
      {children}
    </CloudinaryContext.Provider>
  );
};

export const useCloudinary = () => useContext(CloudinaryContext);

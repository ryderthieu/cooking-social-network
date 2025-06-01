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

  const uploadVideo = async (file, folder = "general") => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "cooking_preset"); // giống preset ảnh
      // formData.append("folder", folder);
      console.log(file)
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dfaq5hbmx/video/upload`, // Lưu ý: /video/upload
        formData
      )
      return response.data; // chứa url, public_id, ...
    }
    catch (error) {
      console.log(error.message)
      throw error
    }


  };
  return (
    <CloudinaryContext.Provider value={{ uploadImage, uploadVideo }}>
      {children}
    </CloudinaryContext.Provider>
  );
};

export const useCloudinary = () => useContext(CloudinaryContext);

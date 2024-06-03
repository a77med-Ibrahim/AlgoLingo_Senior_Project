import React, { useState } from "react";
import apiClient from "./apiClient"; // Adjust the path as necessary

const TestConnection = () => {
  const [status, setStatus] = useState("");

  const testConnection = async () => {
    try {
      const response = await apiClient.get("/api/test"); // Adjust the endpoint URL
      setStatus("Connected successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      setStatus("Failed to connect!");
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Test Connection to Django Backend</h1>
      <button onClick={testConnection}>Test Connection</button>
      <p>Status: {status}</p>
    </div>
  );
};

export default TestConnection;

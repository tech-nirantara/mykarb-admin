import axios from "axios";

// API Configuration
export const api = "http://localhost:8081";
const API_BASE_URL = "http://localhost:8081";

// Create an Axios instance with common configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Update the Authorization header before each request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzY1MzY4Y2RkZWYyN2I3NzQ0YThmYzIiLCJpYXQiOjE3NTczMTcyNjUsImV4cCI6MTc2NTA5MzI2NX0.VA2o_bD3JmpXvp6mYLnjY_NOsdGIuvgTaKvFxHwHvBc";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized error handling
const handleRequestError = (error) => {
  let err = {
    errorType: "Unknown Error",
    message: error.message,
    response: "Failure",
  };

  if (error.response) {
    // Handle HTTP errors (e.g., 404, 500)
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.replace("/login");
    }
    err = {
      errorType: "HTTP Error",
      status: error.response.status,
      message: error.response.data,
      response: "Failure",
    };
  } else if (error.request) {
    // Handle network issues (e.g., no internet connection)
    err = {
      errorType: "Network Error",
      message: error.message,
      response: "Failure",
    };
  }
  return err;
};

// GET request function
export const get = async (url, params = {}) => {
  try {
    const response = await axiosInstance.get(url, params);
    return { data: response.data, response: "Success" };
  } catch (error) {
    return handleRequestError(error);
  }
};

// POST request function
export const post = async (url, data = {}) => {
  try {
    const response = await axiosInstance.post(url, data);
    return { data: response.data, response: "Success" };
  } catch (error) {
    return handleRequestError(error);
  }
};

// PUT request function
export const put = async (url, params = {}) => {
  try {
    const response = await axiosInstance.put(url, params);
    return { data: response.data, response: "Success" };
  } catch (error) {
    return handleRequestError(error);
  }
};

// PATCH request function
export const patch = async (url, data = {}) => {
  try {
    const response = await axiosInstance.patch(url, data);
    return { data: response.data, response: "Success" };
  } catch (error) {
    return handleRequestError(error);
  }
};

// DELETE request function
export const del = async (url, config = {}) => {
  try {
    const response = await axiosInstance.delete(url, config);
    return { data: response.data, response: "Success" };
  } catch (error) {
    return handleRequestError(error);
  }
};

// POST with files
export const postFiles = async (url, data, method = "POST") => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return { data: responseData, response: "Success" };
  } catch (error) {
    return handleRequestError(error);
  }
};

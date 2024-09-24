import axios from "axios";
const baseUrl = import.meta.env.VITE_REACT_SERVER_URL;
console.log(baseUrl);

const instance = axios.create({
  baseURL: baseUrl,
  //   headers: {
  //     Authorization: `Bearer ${localStorage.getItem("token")}`,
  //   }
});

const post = async (url, data) => {
  try {
    console.log("LOG API: ", data)
    const response = await instance.post(url, data);
    console.log("LOG API: ", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const get = async (url) => {
  try {
    const response = await instance.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const put = async (url, data) => {
  try {
    const response = await instance.put(url, data);
    return response.data;

  } catch (error) {
    console.log(error);
  }
};

const del = async (url) => {
  try {
    const response = await instance.delete(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export { post, get, put, del };
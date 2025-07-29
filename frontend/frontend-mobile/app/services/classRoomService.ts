import axios from "axios";
const API_CLASS_URL = 'http://192.168.43.187:8084/api'; // Port de votre microservice de classes

const apiClass = axios.create({
    baseURL: API_CLASS_URL, 
  });
  
  export const getSalleDeClasse = async () => {
    const response = await apiClass.get('/classrooms'); 
    return response.data;
  };
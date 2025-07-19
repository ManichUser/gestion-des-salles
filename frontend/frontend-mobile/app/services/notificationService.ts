import axios from 'axios';

const API_NOTIFICATION_URL = "http://192.168.137.135:8080/api"; // Port de votre microservice de notifications

const apiNotification = axios.create({
    baseURL: API_NOTIFICATION_URL, 
});

// export const getNotifications = async () => {
//     const response = await apiNotification.get('/notifications'); 
// };
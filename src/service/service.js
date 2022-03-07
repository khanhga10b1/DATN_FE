import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://k-booking.herokuapp.com',
    //baseURL: 'http://localhost:8080',
    //baseURL: 'https://booking-hotel-manage.herokuapp.com/api',
    // timeout: 5000,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Accept': 'application/json' }
});

export const setAuthToken = token => {
    if (token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete instance.defaults.headers.common['Authorization'];
    }
};

export default instance;

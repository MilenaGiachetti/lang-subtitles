import axios from 'axios';
const API_KEY = ""; // API_KEY

export default axios.create({
    baseURL:'https://www.googleapis.com/youtube/v3',
    params:
    {
        key: API_KEY
    }
})
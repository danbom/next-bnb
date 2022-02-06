//* api 간편하게 사용하기 위해 baseURL 가진 axios 만들어 사용하기
import Axios from "axios";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export default axios;

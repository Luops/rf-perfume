import axios from "axios";

export const urls = {
  dev: "http://localhost:3000/api/",
};

const ajaxAdapter = axios.create({
  baseURL: urls.dev,
  timeout: 10000,
});

// ajaxAdapter.defaults.withCredentials = true;
// ajaxAdapter.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
//   try {
//     // config.headers["Authorization"] = `Bearer ${authService.getToken()}`;

//     return config;
//   } catch (error) {
//     console.log(error);
//     return config;
//   }
// });

// // ajaxAdapter.interceptors.response.use(
  
// // );

// const config: AxiosRequestConfig = {};
// ajaxAdapter(config);
export default ajaxAdapter;

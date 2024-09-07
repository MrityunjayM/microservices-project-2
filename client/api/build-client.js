import axios from "axios";

/** @type {string} BASE_URL */
export const BASE_URL = process.env.NEXT_PUBLIC_HOST;

export default ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server
    return axios.create({
      // baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      baseURL: BASE_URL,
      headers: { ...req.headers },
    });
  } else {
    // We must be on the browser
    return axios.create({ baseURL: BASE_URL });
  }
};

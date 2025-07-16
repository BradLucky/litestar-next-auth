"use client";

import axios from "axios";
import { API_URL} from "../constants";

const Test = () => {
  const response = axios.get(`${API_URL}/user`, {withCredentials: true});

  return (
    <main className="main">
      Test: {response.data ? response.data : "No data received"}
    </main>
  )
}

export default Test;

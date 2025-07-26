"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL} from "../constants";

const Test = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/user`, {withCredentials: true});
        console.log("Response:", response);
        setData(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <main className="main">Loading...</main>;
  if (error) return <main className="main">Error: {error}</main>;

  return (
    <main className="main">
      Test: {data ? JSON.stringify(data) : "No data received"}
    </main>
  )
}

export default Test;

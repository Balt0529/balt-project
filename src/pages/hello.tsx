import axios from "axios";
import { useEffect, useState } from "react";

export default function Hello() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function getMessage() {
      try {
        const url = "https://localhost:8000";
        const res = await axios.get(url);
        setMessage(res.data.message);
      } catch (err) {
        console.error(err);
      }
    }
    getMessage();
  }, []);

  return (
    <>
      <h1>{message}</h1>
    </>
  );
}
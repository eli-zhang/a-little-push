import {
    Navigate
} from "react-router-dom";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../constants";

export const ReturnPage = () => {
    const [status, setStatus] = useState(null);
  
    useEffect(() => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get('session_id');
  
      fetch(`${BACKEND_URL}/session-status?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status);
        });
    }, []);
  
    if (status === 'open') {
      return (
        <Navigate to="/start" />
      )
    }
  
    if (status === 'complete') {
      return (
        <Navigate to="/home" />
      )
    }
  
    return null;
}  
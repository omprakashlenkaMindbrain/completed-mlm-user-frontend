import { useEffect, useState } from "react";
import BASE_URL from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import { getAuthUse } from "../user/getAuthUse";

export default function useDownlineTree() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [memId, setMemId] = useState(null);

  const { getaccesstoken } = useAuth();
  const { getLoggedinuser } = getAuthUse();
  

  // Step 1: Get Logged-in User → Extract memId
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRes = await getLoggedinuser(getaccesstoken);

        if (userRes?.user?.memId) {
          setMemId(userRes.user.memId);
        } else {
          console.error("No memId found in user response:", userRes);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to fetch user");
      }
    };

    fetchUser();
  }, [getaccesstoken, getLoggedinuser]);

  // Step 2: Fetch Downline automatically when memId is set
  useEffect(() => {
    if (!memId) return;

    const fetchDownline = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${BASE_URL}/api/downline/${memId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getaccesstoken}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        console.log("Downline response:", json);

        if (!json.success) throw new Error(json.message || "Failed to fetch downline");

        setData(json.data);
      } catch (err) {
        console.error("Fetch downline failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDownline();
  }, [memId, getaccesstoken]);

  return { data, error, loading, memId };
}

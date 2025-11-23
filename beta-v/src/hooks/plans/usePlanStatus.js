import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAuthUse } from "../user/getAuthUse";

export const usePlanStatus = () => {
  const { getLoggedinuser } = getAuthUse();
  const { getaccesstoken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [planStatus, setPlanStatus] = useState("pending");
  const [isPlanApproved, setIsPlanApproved] = useState(false);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const token = typeof getaccesstoken === "function" ? getaccesstoken() : getaccesstoken;
      if (!token) throw new Error("No access token");

      const res = await getLoggedinuser(token);
      const user = res?.data?.user || null;

      setProfile(user);

      const plan = user?.plan?.status || "pending";
      setPlanStatus(plan);
      setIsPlanApproved(plan === "approved");
    } catch (err) {
      console.error("Failed to fetch plan status:", err);
      setProfile(null);
      setPlanStatus("pending");
      setIsPlanApproved(false);
    } finally {
      setLoading(false);
    }
  }, [getLoggedinuser, getaccesstoken]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    loading,
    profile,
    planStatus,
    isPlanApproved,
    refresh: fetchStatus,
  };
};

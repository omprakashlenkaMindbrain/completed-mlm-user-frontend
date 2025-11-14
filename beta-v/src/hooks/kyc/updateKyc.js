import { useCallback, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export const useUpdateKyc = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {getaccesstoken}=useAuth();

  const updateKyc = useCallback(async (adharaFile, panFile) => {

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      if (adharaFile) formData.append("adhara_img", adharaFile);
      if (panFile) formData.append("pan_img", panFile);

      const res = await fetch("http://localhost:8030/kyc/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getaccesstoken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Failed to update KYC");
      }

      setSuccess(true);
      return data;
    } catch (err) {
      console.error("KYC update error:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateKyc, loading, error, success };
};

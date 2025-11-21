import { useState } from "react";
import BASE_URL from "../../config/api";
import { useAuth } from "../../context/AuthContext";

export const useKycUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { getaccesstoken } = useAuth();

  const uploadKyc = async ({ adharFile, panFile }) => {
    setLoading(true);
    setError(null);

    try {
      if (!adharFile || !panFile)
        throw new Error("Both Aadhaar and PAN images are required");

      const formData = new FormData();
      formData.append("adhara_img", adharFile);
      formData.append("pan_img", panFile);

      const res = await fetch(`${BASE_URL}/api/kyc/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getaccesstoken}`,
        },
        body: formData,
      });

      // Handle backend error response
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.msg || errData.message || "Upload failed");
      }

      const responseData = await res.json();
      setData(responseData);
      return responseData;
    } catch (err) {
      console.log("Caught error:", err.message);
      setError(err.message); // <-- FIXED
      throw err;             // You can remove this if you don't want to rethrow
    } finally {
      setLoading(false);
    }
  };

  return { uploadKyc, loading, error, data };
};

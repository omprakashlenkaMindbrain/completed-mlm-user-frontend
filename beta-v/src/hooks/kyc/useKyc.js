import { useState } from "react";
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
      if (!adharFile || !panFile) throw new Error("Both Aadhaar and PAN images are required");

      const formData = new FormData();
      formData.append("adhara_img", adharFile);
      formData.append("pan_img", panFile);    

      const res = await fetch("http://[2a02:4780:12:b6cb::1]:8030/kyc/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getaccesstoken}`, 
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.msg || "Upload failed");
      }

      const responseData = await res.json();
      console.log(responseData);
      setData(responseData);
      return responseData;
    } catch (err) {
      console.log("Hello")
      setError(err.msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { uploadKyc, loading, error, data };
};

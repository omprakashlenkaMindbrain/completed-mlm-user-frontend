import { useState } from "react";
import BASE_URL from "../../config/api";

export const useGetQr = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrData, setQrData] = useState(null);

  const getAdminQr = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/admin/qr`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch QR data");

      //  Extract QR image URL properly
      const qrUrl =
        data && data.qr && Array.isArray(data.qr) && data.qr.length > 0
          ? data.qr[0].qr
          : null;

      setQrData(qrUrl);
      return qrUrl;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getAdminQr, loading, error, qrData };
};

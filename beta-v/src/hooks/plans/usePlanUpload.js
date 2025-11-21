import { useState } from "react";
import Swal from "sweetalert2";
import BASE_URL from "../../config/api";
import { useAuth } from "../../context/AuthContext";

export const usePlanUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getaccesstoken } = useAuth();

  const uploadPlan = async (plan_name, paymentFile) => {
    setLoading(true);
    setError(null);

    try {
      // Basic validations
      if (!plan_name) throw new Error("Please select a plan");
      if (!paymentFile) throw new Error("Please upload a payment screenshot");

      // 🔥 FILE SIZE VALIDATION — MAX 1 MB
      const maxSize = 1 * 1024 * 1024; // 1 MB
      if (paymentFile.size > maxSize) {
        await Swal.fire({
          icon: "warning",
          title: "File Too Large",
          text: "The image must be less than 1 MB. Please upload a smaller image.",
          confirmButtonColor: "#f0ad4e",
        });
        throw new Error("File size exceeds 1MB");
      }

      const formData = new FormData();
      formData.append("plan_name", plan_name);
      formData.append("payment_ss", paymentFile);

      const res = await fetch(`${BASE_URL}/api/plan`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getaccesstoken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 || data.msg?.includes("duplicate")) {
          await Swal.fire({
            icon: "warning",
            title: "Plan Already Purchased",
            text: "You already have an active plan.",
            confirmButtonColor: "#f0ad4e",
          });
        } else {
          await Swal.fire({
            icon: "error",
            title: "Plan Upload Failed",
            text: data.msg || "Something went wrong.",
            confirmButtonColor: "#d33",
          });
        }
        throw new Error(data.msg || "Plan upload failed");
      }

      await Swal.fire({
        icon: "success",
        title: "Plan Uploaded Successfully!",
        text: "Your plan has been submitted.",
        confirmButtonColor: "#0E562B",
        timer: 2000,
        showConfirmButton: false,
      });

      return data;

    } catch (err) {
      console.error("Plan upload error:", err);
      setError(err.message);
      throw err;

    } finally {
      setLoading(false);
    }
  };

  return { uploadPlan, loading, error };
};

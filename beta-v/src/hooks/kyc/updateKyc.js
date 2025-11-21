import { useCallback, useState } from "react";
import BASE_URL from "../../config/api";
import { useAuth } from "../../context/AuthContext";

const MAX_FILE_SIZE = 1048576; // 1MB

export const useUpdateKyc = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const { getaccesstoken } = useAuth();

    const updateKyc = useCallback(async (adharaFile, panFile) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        // -------- FRONTEND VALIDATION -----------
        try {
            if (adharaFile && adharaFile.size > MAX_FILE_SIZE) {
                throw new Error("Aadhaar file size cannot exceed 1 MB.");
            }

            if (panFile && panFile.size > MAX_FILE_SIZE) {
                throw new Error("PAN file size cannot exceed 1 MB.");
            }
        } catch (validationError) {
            setError(validationError.message);
            setLoading(false);
            return null;
        }

        // -------- API CALL ---------------
        try {
            const formData = new FormData();
            if (adharaFile) formData.append("adhara_img", adharaFile);
            if (panFile) formData.append("pan_img", panFile);

            const res = await fetch(`${BASE_URL}/api/kyc/update`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${getaccesstoken}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok || data.success === false) {
                throw new Error(data.msg || "An unknown error occurred while updating KYC.");
            }

            setSuccess(true);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [getaccesstoken]);

    return { updateKyc, loading, error, success };
};

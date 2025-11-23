import BASE_URL from "../../config/api";

export const getAdmin = () => {
    const getAdminInfo = async (accesstoken) => {
        try {
            const res = await fetch(`${BASE_URL}/api/admin/sessions`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accesstoken}`,
                },
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            return data;
        } catch (err) {
            console.error("Failed to fetch admin info:", err.message);
            throw err;
        }
    };

    return { getAdminInfo };
};

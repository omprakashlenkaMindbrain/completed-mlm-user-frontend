import { useEffect, useState } from "react";
import BASE_URL from "../../config/api";

export function useUsers(initialPage = 1, initialLimit = 10) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(initialLimit);

  const fetchUsers = async (page = currentPage, limitPerPage = limit) => {
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      const res = await fetch(
        `${BASE_URL}/api/user/Allplandetails?page=${page}&limit=${limitPerPage}`
      );
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();

      if (!json.data) throw new Error("No data returned from API");

      const mappedUsers = json.data.map((u) => ({
        id: u._id || u.id,
        name: u.name || "Unknown",
        email: u.email || "Unknown",
        phone: u.mobno || u.phone || "Unknown",
        kycStatus:
          u.kyc?.status === "approved"
            ? "Verified"
            : u.kyc?.status === "rejected"
            ? "Rejected"
            : "Pending",
        subscription: u.plan
          ? `${u.plan.plan_name
              ?.charAt(0)
              .toUpperCase() + u.plan.plan_name?.slice(1)} Plan`
          : "None",
        reviewedAt: u.reviewedAt || null,
        rejectionReason: u.adminComment || "",
        createdAt: u.createdAt || null,
        kycDocs: u.kyc || null,
        planDocs: u.plan || null,
      }));

      setUsers(mappedUsers);

      setCurrentPage(json.pagination?.currentPage || 1);
      setTotalPages(json.pagination?.totalPages || 1);
      setLimit(json.pagination?.limit || limitPerPage);
    } catch (err) {
      setErrorUsers(err.message);
      console.error("Failed to fetch users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, limit);
  }, [currentPage, limit]);

  useEffect(() => {
    console.log("Users updated:", users);
  }, [users]);

  return {
    users,
    loadingUsers,
    errorUsers,
    currentPage,
    totalPages,
    limit,
    setCurrentPage,
    fetchUsers,
  };
}

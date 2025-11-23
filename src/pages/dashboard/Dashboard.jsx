import {
  Award,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Filter,
  Mail,
  Phone,
  Sparkles,
  Star,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import BASE_URL from "../../config/api";
import { useAuth } from "../../context/Authcontext";
import { useUsers } from "../../hooks/getusersdetails/getUsersDetails";

export default function Dashboard() {
  const colors = {
    blue: "var(--bmpl-blue)",
    gold: "var(--bmpl-gold)",
    green: "var(--bmpl-green)",
    red: "#DC2626",
    silverText: "#254db0",
    silverBg: "#f3f4f6",
    grayText: "#a3a3a3",
    grayBg: "#f3f4f6",
  };

  const {
    users,
    loadingUsers,
    errorUsers,
    currentPage,
    totalPages,
    limit,
    setCurrentPage,
    fetchUsers,
  } = useUsers(1, 10);

  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const { accessToken } = useAuth();

  // Filter and search are applied only on current page users from backend
  const filteredUsers = users.filter((u) => {
    const matchFilter = filter === "All" || u.kycStatus === filter;
    const searchLower = searchTerm.toLowerCase();
    return (
      matchFilter &&
      (u.name.toLowerCase().includes(searchLower) || u.phone.includes(searchTerm))
    );
  });

  // Pagination UI helper function
  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  // Update KYC status API call


  //update plan

  const updatePlan = async (id, status, reason) => {
    setLoadingUpdate(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/plan/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: status.toLowerCase(), adminComment: reason || "" }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.message || "Update failed");

      // Update selected user plan if this is the same user
      setSelectedUser((prevUser) => {
        if (!prevUser) return null;
        if (prevUser.id === data.data.userId) {
          return { ...prevUser, planDocs: data.data };
        }
        return prevUser;
      });

      // Ideally refetch users or update users list managed by useUsers hook
      fetchUsers(currentPage, limit); // Refresh the user list after update

      setSelectedUser(null); // close modal
    } catch (err) {
      alert("Failed to update plan status: " + err.message);
    } finally {
      setLoadingUpdate(false);
    }
  };


  console.log(users);







  // Download document helper
  const handleDownload = (url, label) => {
    if (!url) {
      alert("Document not available");
      return;
    }
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = label;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle filter change
  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
    fetchUsers(1, limit);
  };

  // Handle search change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 text-sm">Manage and review KYC submissions efficiently</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Total Users", value: users.length, icon: <Users size={28} style={{color:"black"}}/>, color: colors.blue },
          { label: "Pending", value: users.filter(u => u.planDocs?.status === "pending").length, icon: <Clock size={28} style={{color:"black"}}/>, color: colors.gold },
          { label: "Approved", value: users.filter(u => u.planDocs?.status === "approved").length, icon: <CheckCircle size={28} style={{color:"black"}}/>, color: colors.green },
          { label: "Rejected", value: users.filter(u => u.planDocs?.status === "rejected").length, icon: <XCircle size={28} style={{color:"black"}}/>, color: colors.red },
        ].map(s => (
          <div
            key={s.label}
            className="p-6 rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-all flex items-center justify-between"
            style={{ background: s.color, color: "white" }}
          >
            <div>
              <p className="text-sm">{s.label}</p>
              <p className="text-3xl font-bold mt-1">{s.value || 0}</p>
            </div>
            <div className="p-3 rounded-xl bg-white">{s.icon}</div>
          </div>
        ))}
      </div>




      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">KYC Submissions</h2>
            <p className="text-xs text-slate-500">Review and manage verification requests</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-white rounded-md px-3 py-1.5 border border-slate-300">
              <Filter size={14} className="text-slate-400" />
              <select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="bg-transparent text-sm text-slate-700 outline-none cursor-pointer"
              >
                <option>All</option>
                <option>Pending</option>
                <option>Verified</option>
                <option>Rejected</option>
              </select>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by name or mobile"
              className="border border-slate-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-bmpl-blue"
            />
            <select
              value={limit}
              onChange={(e) => {
                const newLimit = parseInt(e.target.value, 10);
                setCurrentPage(1);
                fetchUsers(1, newLimit);
              }}
              className="bg-white text-sm border border-slate-300 rounded-md px-3 py-1.5 cursor-pointer"
              aria-label="Rows per page"
            >
              {[5, 10, 20, 50].map((val) => (
                <option key={val} value={val}>
                  {val} per page
                </option>
              ))}
            </select>
          </div>
        </div>

        {loadingUsers ? (
          <div className="p-10 text-center text-slate-500 text-sm">Loading users...</div>
        ) : errorUsers ? (
          <div className="p-10 text-center text-red-600 text-sm">{errorUsers}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-sm">No records found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-[950px] w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium">User</th>
                    <th className="px-5 py-3 text-left font-medium">Contact</th>
                    <th className="px-5 py-3 text-left font-medium">Subscription</th>
                    <th className="px-5 py-3 text-left font-medium">Status</th>
                    <th className="px-5 py-3 text-left font-medium">Updated</th>
                    <th className="px-5 py-3 text-center font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition duration-150">
                      <td className="px-5 py-3 font-medium text-slate-900">
                        {user.name}
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail size={12} /> {user.email}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-slate-700 flex items-center gap-1">
                        <Phone size={13} className="text-slate-400" />
                        {user.phone}
                      </td>
                      <td className="px-5 py-3">
                        <SubscriptionBadge plan={user.subscription} colors={colors} />
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge
                          status={user.planDocs?.status} // <-- use plan status from API
                          reason={user.planDocs?.adminComment} // optional rejection reason
                          colors={colors}
                        />
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-xs">{user.reviewedAt || user.createdAt || "N/A"}</td>
                      <td className="px-5 py-3 text-center">
                        <button
                          disabled={loadingUpdate}
                          onClick={() => setSelectedUser(user)}
                          className={`px-3 py-1.5 text-white rounded-md text-xs font-medium shadow-sm ${loadingUpdate ? "bg-gray-400 cursor-not-allowed" : ""
                            }`}
                          style={{ backgroundColor: loadingUpdate ? undefined : colors.blue }}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-slate-200 bg-slate-50">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-slate-600">
                    Showing <span className="font-semibold text-slate-900">1</span> to{" "}
                    <span className="font-semibold text-slate-900">{filteredUsers.length}</span> of{" "}
                    <span className="font-semibold text-slate-900">{users.length}</span> users
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                          fetchUsers(currentPage - 1, limit);
                        }
                      }}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-slate-300 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <div className="flex items-center gap-1">
                      {getPaginationNumbers().map((page, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (typeof page === "number" && page !== currentPage) {
                              setCurrentPage(page);
                              fetchUsers(page, limit);
                            }
                          }}
                          disabled={page === "..."}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition ${page === currentPage
                            ? "bg-bmpl-blue text-white shadow-md"
                            : page === "..."
                              ? "text-slate-500 cursor-default"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                            }`}
                          aria-label={typeof page === "number" ? `Go to page ${page}` : undefined}
                          aria-current={page === currentPage ? "page" : undefined}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1);
                          fetchUsers(currentPage + 1, limit);
                        }
                      }}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-slate-300 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition"
                      aria-label="Next page"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selectedUser && (
        <ReviewModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={updatePlan}
          onDownload={handleDownload}
          loading={loadingUpdate}
          colors={colors}
        />
      )}
    </div>
  );
}

function StatusBadge({ status, reason, colors }) {
  // Ensure status is a string and lowercase for consistent mapping
  const key = status ? status.toLowerCase() : "pending";

  const config = {
    approved: {
      icon: <CheckCircle size={14} />,
      style: { background: colors.green, color: "white" },
      label: "Approved",
    },
    pending: {
      icon: <Clock size={14} />,
      style: { background: colors.gold, color: "white" },
      label: "Pending",
    },
    rejected: {
      icon: <XCircle size={14} />,
      style: { background: colors.red, color: "white" },
      label: "Rejected",
    },
  }[key];

  return (
    <div>
      <div
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border border-transparent"
        style={config.style}
      >
        {config.icon}
        {config.label}
      </div>
      {reason && reason !== "" && (
        <p className="text-[11px] text-[#ff3b3b] italic mt-1">{reason}</p>
      )}
    </div>
  );
}

function SubscriptionBadge({ plan, colors }) {
  const config = {
    "Gold Plan": {
      icon: <Award size={16} style={{ color: "white" }} />,
      style: { background: colors.gold, color: "white" },
    },
    "Silver Plan": {
      icon: <Sparkles size={16} style={{ color: colors.silverText }} />,
      style: { background: colors.silverBg, color: colors.silverText },
    },
    "Premium Plan": {
      icon: <Star size={16} style={{ color: "white" }} />,
      style: { background: "var(--bmpl-teal)", color: "white" },
    },
    "Platinum Plan": {
      icon: <Star size={16} style={{ color: "white" }} />,
      style: { background: colors.blue, color: "white" },
    },
    None: {
      icon: <Star size={16} style={{ color: colors.grayText }} />,
      style: { background: colors.grayBg, color: colors.grayText },
    },
  }[plan || "None"];

  return (
    <div
      className="inline-flex items-center gap-2 px-2 py-1 rounded-md border text-xs font-medium border-transparent"
      style={config.style}
    >
      {config.icon}
      {plan}
    </div>
  );
}

function ReviewModal({ user, onClose, onUpdate, onDownload, loading }) {
  const [reason, setReason] = useState("");

  const allDocs = [
    { label: "Aadhaar Card", url: user.kycDocs?.adhara_img },
    { label: "PAN Card", url: user.kycDocs?.pan_img },
    { label: "Payment Screenshot", url: user.planDocs?.payment_ss },
  ];

  const availableDocs = allDocs.filter((doc) => doc.url);
  const missingDocsCount = allDocs.length - availableDocs.length;

  // Determine current status from plan
  const status = user.planDocs?.status ? user.planDocs.status.toLowerCase() : "pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center px-5 py-3 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-900 text-lg">Review Plan – {user.name}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" disabled={loading}>
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 text-sm space-y-3 max-h-[70vh] overflow-y-auto">
          <p><span className="text-slate-500">Email:</span> {user.email}</p>
          <p><span className="text-slate-500">Phone:</span> {user.phone}</p>

          <div className="mt-4">
            <p className="font-medium text-slate-700 mb-2">Documents:</p>
            {availableDocs.length > 0 ? (
              <>
                {availableDocs.map((d) => (
                  <div key={d.label} className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-md px-3 py-2 mb-2">
                    <div className="flex items-center gap-2 text-slate-700">
                      <FileText size={14} className="text-bmpl-blue" />
                      {d.label}
                    </div>
                    <button
                      onClick={() => onDownload(d.url, `${user.name}-${d.label}`)}
                      className="text-bmpl-blue hover:text-[#254db0e0] text-xs flex items-center gap-1"
                      disabled={loading}
                    >
                      <Download size={12} /> Download
                    </button>
                  </div>
                ))}
                {missingDocsCount > 0 && (
                  <p className="text-rose-600 italic text-xs">
                    Another document{missingDocsCount > 1 ? "s are" : " is"} missing.
                  </p>
                )}
              </>
            ) : (
              <p className="text-rose-600 italic text-xs">No documents available.</p>
            )}
          </div>

          {/* Show reason textarea only for pending plans */}
          {status === "pending" && (
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="Optional rejection reason..."
              className="w-full mt-2 border border-slate-300 rounded-md p-2 text-sm focus:ring-bmpl-blue focus:border-bmpl-blue"
              disabled={loading}
            />
          )}
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50">
          {status === "pending" ? (
            <>
              <button
                onClick={(e) => {
                  e.currentTarget.innerText = "Processing...";
                  e.currentTarget.disabled = true;
                  onUpdate(user.id, "rejected", reason);
                }}
                className="px-4 py-1.5 bg-rose-600 text-white rounded-md text-xs hover:bg-rose-700 transition-all duration-200"
              >
                Reject
              </button>
              <button
                onClick={(e) => {
                  e.currentTarget.innerText = "Processing...";
                  e.currentTarget.disabled = true;
                  onUpdate(user.id, "approved");
                }}
                className="px-4 py-1.5 bg-[#259f64] text-white rounded-md text-xs hover:bg-[#259f64] transition-all duration-200"
              >
                Approve
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-md text-xs"
              disabled={loading}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


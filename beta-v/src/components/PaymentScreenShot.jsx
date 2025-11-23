import { CreditCard, Eye, Save } from "lucide-react";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { useUpdatePayment } from "../hooks/plans/updatePlan";
import { usePlanStatus } from "../hooks/plans/usePlanStatus"; // plan-only hook

const PRIMARY_NAVY = "#1B436D";
const ICON_COLOR_CONTACT = "#1D9E74";

export default function PaymentScreenshotSection() {
  const { loading, planStatus, isPlanApproved, profile, refresh } = usePlanStatus();
  const { updatePayment, loading: uploading, error: uploadError, success } = useUpdatePayment();
  const [paymentFile, setPaymentFile] = useState(null);
  const fileInputRef = useRef(null);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-lg flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return <div className="p-6 bg-white rounded-2xl shadow-lg text-red-600">No profile data found.</div>;
  }

  console.log(planStatus);
  

  const statusClasses = {
    approved: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
    rejected: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
  };

  const currentStatus = statusClasses[planStatus] || statusClasses["pending"];
  const displayStatus = planStatus.charAt(0).toUpperCase() + planStatus.slice(1);
  const paymentImageUrl = profile?.plan?.payment_ss || null;

  const handlePaymentUpload = async () => {
    if (!paymentFile) {
      Swal.fire("No File", "Please select a payment screenshot to upload.", "info");
      return;
    }

    const planId = profile?.plan?._id;
    if (!planId) {
      Swal.fire("Error", "Plan not found for this user.", "error");
      return;
    }

    const response = await updatePayment(planId, paymentFile);

    if (response?.success) {
      Swal.fire("Success", "Payment screenshot uploaded successfully!", "success");
      setPaymentFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      refresh(); // refresh plan status and profile
    } else {
      Swal.fire("Error", uploadError || "Failed to upload screenshot.", "error");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <CreditCard className="w-5 h-5" style={{ color: ICON_COLOR_CONTACT }} />
        Payment Screenshot
      </h2>

      {/* Plan Status */}
      <div className="flex items-center justify-between mb-6 p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <p className="font-semibold text-slate-800 flex items-center gap-2">
          <CreditCard className="w-5 h-5" style={{ color: PRIMARY_NAVY }} /> Payment Status:
        </p>
        <span
          className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}
        >
          {displayStatus}
        </span>
      </div>

      {/* Current Screenshot */}
      <div className="border-2 border-slate-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Eye className="w-6 h-6" style={{ color: PRIMARY_NAVY }} />
          <div>
            <p className="font-semibold text-slate-900">Current Screenshot</p>
            {paymentImageUrl ? (
              <a
                href={paymentImageUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium hover:underline"
                style={{ color: ICON_COLOR_CONTACT }}
              >
                View Current
              </a>
            ) : (
              <p className="text-sm text-gray-500">No screenshot uploaded yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Show upload section only if plan is not approved */}
      {!isPlanApproved && (
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-slate-400 transition cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setPaymentFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
              <CreditCard className="w-8 h-8 text-slate-400" />
              <p className="font-semibold text-slate-700">
                {paymentFile ? paymentFile.name : "Click to upload payment screenshot"}
              </p>
              <p className="text-xs text-slate-500">Max file size: 1 MB (JPG, PNG, GIF)</p>
            </div>
          </div>

          <button
            onClick={handlePaymentUpload}
            disabled={uploading || !paymentFile}
            className={`w-full px-6 py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 ${
              uploading || !paymentFile ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Update Payment Screenshot
              </>
            )}
          </button>

          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm font-medium">
              {uploadError}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm font-medium">
              Payment screenshot uploaded successfully!
            </div>
          )}
        </div>
      )}

      {/* Approved status message */}
      {isPlanApproved && (
        <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
          <p className="text-green-700 font-semibold flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
              ✓
            </div>
            Your payment has been verified and approved!
          </p>
        </div>
      )}
    </div>
  );
}

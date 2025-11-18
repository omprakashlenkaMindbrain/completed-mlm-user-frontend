import { useKycStatus } from "../hooks/kyc/useKycStatus";

export default function KycProtectedRoute({ children }) {
  const { loading, isApproved, status } = useKycStatus();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">Checking your KYC status...</p>
      </div>
    );
  }

  if (!isApproved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h2 className="text-2xl font-bold text-red-600 mb-3">
          KYC Verification Required
        </h2>

        <p className="text-lg text-gray-700 text-center max-w-lg">
          {status === "rejected"
            ? "Your KYC was rejected. Please re-submit correct documents."
            : status === "pending"
            ? "Your KYC is pending. Please wait until the admin approves your documents."
            : "You have not submitted your KYC yet. Please complete your verification first."}
        </p>
      </div>
    );
  }

  // If approved, show the plan page
  return children;
}

import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { useKycUpload } from "../../hooks/kyc/useKyc";

const PRIMARY_COLOR = "var(--primary-color, #004aad)";
const BG_LIGHT = "var(--bg-light, #f8fafc)";
const ERROR_COLOR = "#d33";

export default function KYCPage() {
  const [aadhaar, setAadhaar] = useState(null);
  const [pan, setPan] = useState(null);
  const [showSlow, setShowSlow] = useState(false);
  const [uploadTime, setUploadTime] = useState(0);

  const { uploadKyc, loading, error } = useKycUpload();
  const timerRef = useRef(null);

  const handleFileChange = (e, setter) => {
    const file = e.target.files && e.target.files[0];
    if (file) setter(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!aadhaar || !pan) {
      Swal.fire({
        icon: "warning",
        title: "Missing Documents",
        text: "Please upload both Aadhaar and PAN card before submitting.",
        confirmButtonColor: PRIMARY_COLOR,
      });
      return;
    }

    setUploadTime(0);
    setShowSlow(false);

    timerRef.current = setInterval(() => {
      setUploadTime((prev) => {
        if (prev + 1 >= 3) setShowSlow(true);
        return prev + 1;
      });
    }, 1000);

    try {
      await uploadKyc({ adharFile: aadhaar, panFile: pan });

      Swal.fire({
        icon: "success",
        title: "KYC Submitted Successfully!",
        text: "Your documents have been uploaded and are under verification.",
        confirmButtonColor: PRIMARY_COLOR,
      });

      setAadhaar(null);
      setPan(null);

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message,   // <-- DISPLAY BACKEND ERROR HERE
        confirmButtonColor: ERROR_COLOR,
      });
    } finally {
      if (timerRef.current) clearInterval(timerRef.current);
      setUploadTime(0);
      setShowSlow(false);
    }   
  };


  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-10 sm:px-6 overflow-hidden"
      style={{ backgroundColor: BG_LIGHT }}
    >
      <div className="absolute z-0 top-[-150px] left-[-100px] w-[500px] h-[500px] bg-gradient-to-tr from-green-200 to-green-400 opacity-25 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute z-0 bottom-[-180px] right-[-120px] w-[550px] h-[550px] bg-gradient-to-tr from-blue-200 to-blue-400 opacity-20 rounded-full filter blur-3xl animate-pulse" />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 sm:p-8 flex flex-col items-center z-10 transition-all duration-500"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8 w-full">
          <div
            style={{ backgroundColor: PRIMARY_COLOR }}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semiBold text-xl mb-2 shadow-lg"
          >
            BMPL
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-1">
            Upload Your KYC Documents
          </h1>
          <p className="text-sm text-gray-400 text-center">
            Upload your Aadhaar and PAN card for verification.
          </p>
        </div>

        {/* Aadhaar Upload */}
        <div className="w-full mb-5 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 flex flex-row flex-wrap items-center justify-between gap-3 hover:shadow-lg transition-all duration-300">
          <div className="flex flex-row flex-wrap items-center gap-3 min-w-0">
            <span className="text-base font-semibold text-gray-800">1️⃣ Aadhaar</span>
            {aadhaar && (
              <span
                className="text-gray-600 text-xs font-medium bg-gray-100 px-2 py-1 rounded max-w-[140px] sm:max-w-[200px] truncate"
                title={aadhaar.name}
              >
                {aadhaar.name}
              </span>
            )}
          </div>
          {aadhaar ? (
            <button
              type="button"
              className="rounded text-xs font-bold text-red-600 px-2 py-1 transition-all hover:bg-red-50"
              onClick={() => setAadhaar(null)}
            >
              ✕ Remove
            </button>
          ) : (
            <label
              className="cursor-pointer text-xs font-bold text-green-700 hover:text-green-900 transition-all hover:underline"
            >
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={(e) => handleFileChange(e, setAadhaar)}
                className="hidden"
              />
              Choose File
            </label>
          )}
        </div>

        {/* PAN Upload */}
        <div className="w-full mb-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 flex flex-row flex-wrap items-center justify-between gap-3 hover:shadow-lg transition-all duration-300">
          <div className="flex flex-row flex-wrap items-center gap-3 min-w-0">
            <span className="text-base font-semibold text-gray-800">2️⃣ PAN</span>
            {pan && (
              <span
                className="text-gray-600 text-xs font-medium bg-gray-100 px-2 py-1 rounded max-w-[140px] sm:max-w-[200px] truncate"
                title={pan.name}
              >
                {pan.name}
              </span>
            )}
          </div>
          {pan ? (
            <button
              type="button"
              className="rounded text-xs font-bold text-red-600 px-2 py-1 transition-all hover:bg-red-50"
              onClick={() => setPan(null)}
            >
              ✕ Remove
            </button>
          ) : (
            <label
              className="cursor-pointer text-xs font-bold text-green-700 hover:text-green-900 transition-all hover:underline"
            >
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={(e) => handleFileChange(e, setPan)}
                className="hidden"
              />
              Choose File
            </label>
          )}
        </div>

        {/* Loader & Submit */}
        <button
          type="submit"
          disabled={!aadhaar || !pan || loading}
          className="w-full py-3 rounded-xl font-bold text-white text-lg transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          style={{ backgroundColor: "#fdbb2d", cursor: "pointer" }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              <span>
                {showSlow ? "Network is slow, please wait..." : "Uploading..."}
                {uploadTime > 1 && (
                  <span className="ml-2 text-xs font-normal">({uploadTime}s)</span>
                )}
              </span>
            </span>
          ) : (
            "Submit KYC Documents"
          )}
        </button>

        {/* Error Message */}
        {error && <p className="text-red-600 mt-3 text-xs text-center">{error}</p>}

        <p className="text-xs text-gray-400 text-center mt-6">
          *Your documents are encrypted and stored securely.
        </p>
      </form>
    </div>
  );
}
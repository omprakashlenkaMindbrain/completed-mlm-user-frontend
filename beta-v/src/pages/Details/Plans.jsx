import { CheckCircle, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { useGetQr } from "../../hooks/getqrcode/useGetQr";
import { usePlanUpload } from "../../hooks/plans/usePlanUpload";

const PRIMARY_NAVY = "#1B436D";
const BUTTON_COLOR = "#fdbb2d";
const SOFT_GREEN = "#1D9E74";

const plans = [
  {
    id: 1,
    name: "Gold",
    price: 1500,
    description: "Perfect for getting started",
    color: "from-yellow-400 via-amber-400 to-yellow-500",
    features: [
      "Basic Support",
      "Access to Core Tools",
      "Monthly Performance Report",
      "Community Access",
    ],
  },
  {
    id: 2,
    name: "Silver",
    price: 5000,
    description: "Popular for most users",
    color: "from-gray-300 via-gray-400 to-gray-500",
    features: [
      "Priority Email Support",
      "Access to All Tools",
      "Weekly Performance Report",
      "Team Collaboration Features",
      "Ad-Free Experience",
    ],
  },
  {
    id: 3,
    name: "Premium",
    price: 10000,
    description: "Advanced features for growing businesses",
    color: "from-teal-400 via-cyan-500 to-teal-600",
    features: [
      "24/7 Premium Support",
      "Advanced Analytics Dashboard",
      "Custom Branding Options",
      "Dedicated Account Manager",
      "Access to Beta Features",
      "Monthly Strategy Review",
    ],
  },
  {
    id: 4,
    name: "Platinum",
    price: 25000,
    description: "All features included — ultimate experience",
    color: "from-blue-700 via-blue-800 to-blue-900",
    features: [
      "Dedicated Success Manager",
      "24/7 Phone & Chat Support",
      "Unlimited Team Accounts",
      "Custom API Integrations",
      "Exclusive Early Access to New Tools",
      "Personalized Training Sessions",
      "Priority Feature Requests",
    ],
  },
];

export default function Plans() {

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentFile, setPaymentFile] = useState(null);

  const { uploadPlan, loading: uploadLoading } = usePlanUpload();
  const { getAdminQr, qrData, loading: qrLoading } = useGetQr();
  const { getaccesstoken } = useAuth();

  const handleViewDetails = (plan) => {
    setSelectedPlan(plan);
    setPaymentFile(null);
    setShowModal(true);
  };

  // Fetch QR when modal opens
  useEffect(() => {
    if (showModal && getaccesstoken) {
      getAdminQr(getaccesstoken);
    }
  }, [showModal, getaccesstoken]);

  const handlePaymentUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPaymentFile(file);
  };

  const handleSubmitPayment = async () => {
    if (!paymentFile) {
      Swal.fire({
        icon: "warning",
        title: "Missing Screenshot",
        text: "Please upload your payment screenshot before submitting.",
        confirmButtonColor: PRIMARY_NAVY,
      });
      return;
    }

    const confirm = await Swal.fire({
      title: "Confirm Upload?",
      text: `You are about to upload payment for the ${selectedPlan.name} plan.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: PRIMARY_NAVY,
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Upload",
    });

    if (!confirm.isConfirmed) return;

    try {
      await uploadPlan(selectedPlan.name.toLowerCase(), paymentFile);
      Swal.fire({
        icon: "success",
        title: "Payment Uploaded!",
        text: `${selectedPlan.name} plan uploaded successfully.`,
        confirmButtonColor: PRIMARY_NAVY,
      });
      setShowModal(false);
      setPaymentFile(null);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message || "Something went wrong while uploading payment.",
        confirmButtonColor: "#E63946",
      });
    }
  };

  return (
    <>
        <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-transparent to-teal-100 opacity-30 animate-[pulse_6s_ease-in-out_infinite] blur-2xl"></div>

          <div className="relative z-10 py-20 px-6 sm:px-10 lg:px-16">
            <div className="max-w-7xl mx-auto text-center">
              <h1
                className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight"
                style={{ color: PRIMARY_NAVY }}
              >
                Subscription Plans
              </h1>
              <p className="text-gray-600 mb-14 text-base sm:text-lg">
                Choose the plan that best fits your business needs.
              </p>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="group relative bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.05)] 
              hover:shadow-[0_10px_40px_rgba(27,67,109,0.25)] transition-all duration-500 
              p-8 flex flex-col justify-between min-h-[440px] max-w-sm mx-auto 
              hover:-translate-y-3 hover:scale-[1.03]"
                  >
                    <div
                      className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${plan.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-700`}
                    ></div>

                    <div className="relative flex flex-col items-center text-center">
                      <h2
                        className="text-2xl font-bold mb-2"
                        style={{ color: PRIMARY_NAVY }}
                      >
                        {plan.name}
                      </h2>
                      <p
                        className="text-4xl font-extrabold mb-1"
                        style={{ color: SOFT_GREEN }}
                      >
                        ₹{plan.price}
                      </p>
                      <p className="text-gray-500 text-sm mb-5">
                        {plan.description}
                      </p>

                      <div className="w-full text-left space-y-2.5">
                        {plan.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-gray-700"
                          >
                            <CheckCircle
                              size={18}
                              className="shrink-0"
                              style={{ color: SOFT_GREEN }}
                            />
                            <span className="text-[15px] leading-snug truncate">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewDetails(plan)}
                      style={{
                        backgroundColor: BUTTON_COLOR,
                        color: PRIMARY_NAVY,
                      }}
                      className="relative mt-6 w-full font-semibold py-2 rounded-xl shadow-md hover:shadow-lg text-base transition-all duration-300 hover:scale-[1.05]"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
              >
                <X size={22} />
              </button>

              <h2
                className="text-2xl font-bold mb-1"
                style={{ color: PRIMARY_NAVY }}
              >
                {selectedPlan.name} Plan
              </h2>
              <p
                className="text-3xl font-bold mb-3"
                style={{ color: SOFT_GREEN }}
              >
                ₹{selectedPlan.price}
              </p>
              <p className="text-gray-600 mb-5">{selectedPlan.description}</p>

              {/* Dynamic QR */}
              <div className="w-36 h-36 mx-auto bg-gray-300 rounded flex items-center justify-center overflow-hidden">
                {qrLoading ? (
                  <p className="text-sm text-gray-500">Loading QR...</p>
                ) : qrData ? (
                  <img
                    src={qrData}
                    alt="Payment QR"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-sm text-gray-500">No QR available</p>
                )}
              </div>


              {/* Upload */}
              <div className="mb-6">
                <label className="font-semibold text-gray-800 text-sm block mb-1">
                  Upload Payment Screenshot (Required)
                </label>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handlePaymentUpload}
                  className="border border-gray-300 rounded-lg p-2 text-sm w-full"
                />
                {paymentFile && (
                  <p
                    className="font-medium text-sm mt-2"
                    style={{ color: SOFT_GREEN }}
                  >
                    {paymentFile.name}
                  </p>
                )}
              </div>

              <button
                onClick={handleSubmitPayment}
                disabled={uploadLoading}
                style={{ backgroundColor: BUTTON_COLOR, color: PRIMARY_NAVY }}
                className="w-full font-semibold py-3 rounded-xl shadow-md transition-all duration-200 text-lg flex items-center justify-center"
              >
                {uploadLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} /> Processing
                    Payment...
                  </>
                ) : (
                  "Submit Payment"
                )}
              </button>
            </div>
          </div>
        )}
    </>
  );
}

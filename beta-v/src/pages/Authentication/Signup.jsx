import { motion } from "framer-motion";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Hash,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from "../../assets/bmpl.jpg";
import { useAuth } from "../../context/AuthContext";

const VALID_LEGS = ["left", "right"];

export default function SignupPage() {
  const PRIMARY_COLOR = "#004aad";
  const SECONDARY_COLOR = "#fdbb2d";
  const BG_LIGHT = "#f0f4f8";

  const [showPassword, setShowPassword] = useState(false);
  const [displayTrackingId, setDisplayTrackingId] = useState("");
  const [blockedTypingAlertShown, setBlockedTypingAlertShown] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobno: "",
    trackingId: "",
    password: "",
    legPosition: "",
  });

  const { signup, loading, error } = useAuth();

  // Handle paste for tracking ID
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();

    const parts = pasted.split("-");
    if (parts.length === 2 && VALID_LEGS.includes(parts[1].toLowerCase())) {
      setDisplayTrackingId(pasted);
      setFormData((prev) => ({
        ...prev,
        trackingId: parts[0],
        legPosition: parts[1].toLowerCase(),
      }));
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Tracking ID",
        text: "Tracking ID must be in the format: BLO0001-left or BLO0001-right",
        confirmButtonColor: PRIMARY_COLOR,
      });
    }
  };

  // Block typing and show Swal only first time
  const handleKeyDown = (e) => {
    if (!blockedTypingAlertShown) {
      Swal.fire({
        icon: "warning",
        title: "Cannot Type Here",
        text: "Dear user, you cannot write here. Please copy your tracking ID and paste it.",
        confirmButtonColor: PRIMARY_COLOR,
      });
      setBlockedTypingAlertShown(true);
    }

    // Block all typing except paste shortcut
    if (
      !(
        (e.ctrlKey || e.metaKey) &&
        (e.key === "v" || e.key === "V")
      ) &&
      !["ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  // Handle all other field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name !== "trackingId") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.mobno ||
      !formData.trackingId ||
      !formData.legPosition ||
      !formData.password
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please complete all fields and paste a valid Tracking ID.",
        confirmButtonColor: PRIMARY_COLOR,
      });
      return;
    }

    await signup(formData);
  };

  const inputClass =
    "w-full px-3 py-2 text-sm outline-none bg-transparent focus:ring-0";

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: BG_LIGHT }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
      >
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-14 h-14 rounded-full overflow-hidden shadow-md border"
            style={{ borderColor: PRIMARY_COLOR }}
          >
            <img
              src={Logo}
              alt="BMPL Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-2xl font-bold mt-3" style={{ color: PRIMARY_COLOR }}>
            Create Your Account
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Join BMPL Mall to manage your account securely
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name - Email - Phone */}
          {[{ icon: User, name: "name", placeholder: "Full Name", type: "text" },
            { icon: Mail, name: "email", placeholder: "Email Address", type: "email" },
            { icon: Phone, name: "mobno", placeholder: "Phone Number", type: "tel" },
          ].map(({ icon: Icon, name, placeholder, type }) => (
            <div
              key={name}
              className="flex items-center gap-2 border-b border-gray-300 relative"
              onFocus={(e) => {
                e.currentTarget.style.borderBottomColor = PRIMARY_COLOR;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderBottomColor = "#D1D5DB";
              }}
            >
              <Icon size={18} className="text-gray-400" />
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                maxLength={name === "mobno" ? 10 : undefined}
                className={inputClass}
                style={{ textTransform: name === "name" ? "capitalize" : "none" }}
              />
            </div>
          ))}

          {/* TRACKING ID FIELD */}
          <div
            className="flex items-center gap-2 border-b border-gray-300 relative"
            onFocus={(e) => {
              e.currentTarget.style.borderBottomColor = PRIMARY_COLOR;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderBottomColor = "#D1D5DB";
            }}
          >
            <Hash size={18} className="text-gray-400" />
            <input
              type="text"
              name="trackingId"
              placeholder="Paste Tracking ID (e.g. BLO0001-left)"
              value={displayTrackingId}
              onPaste={handlePaste}
              onKeyDown={handleKeyDown} // Block typing + Swal
              className={inputClass}
            />
          </div>

          {/* LEG POSITION DISPLAY */}
          <div className="text-sm text-gray-700 mt-1 ml-1">
            Leg Position:{" "}
            <span className="font-semibold capitalize">
              {formData.legPosition || "Not set (paste with '-left' or '-right')"}
            </span>
          </div>

          {/* PASSWORD */}
          <div
            className="flex items-center gap-2 border-b border-gray-300 relative"
          >
            <Lock size={18} className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm pr-10 outline-none bg-transparent"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          {/* SUBMIT */}
          <motion.button
            whileHover={{
              scale: 1.02,
              backgroundColor: PRIMARY_COLOR,
              color: "#fff",
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center text-black py-2 text-sm rounded-lg font-bold mt-4"
            style={{ backgroundColor: SECONDARY_COLOR }}
          >
            {loading ? "Creating Account..." : "Create Account"}
            <ArrowRight size={18} className="ml-2" />
          </motion.button>
        </form>

        {/* FOOTER */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: PRIMARY_COLOR }}
            className="hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

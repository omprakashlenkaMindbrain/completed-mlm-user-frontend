import {
    Award,
    BadgeCheck,
    Briefcase,
    CreditCard,
    Edit2,
    Eye,
    FileText,
    Award as IdCard,
    Mail,
    Save,
    X,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Swal from "sweetalert2"
import { useAuth } from "../../context/AuthContext"
import { useUpdateKyc } from "../../hooks/kyc/updateKyc"
import { getAuthUse } from "../../hooks/user/getAuthUse"
import { useEditUser } from "../../hooks/user/useEditUser"


const PRIMARY_NAVY = "#1B436D"
const ACCENT_YELLOW_BUTTON = "#FDBB2D"
const ICON_COLOR_CONTACT = "#1D9E74"

export default function ProfilePage() {
    const { getaccesstoken } = useAuth();
    
    const { getLoggedinuser } = getAuthUse()
    const { editUser, loading: saving, error: saveError, successMsg } = useEditUser()

    const [profile, setProfile] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [modified, setModified] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const formRef = useRef(null);

    const { updateKyc, loading: uploading, error: uploadError, success } = useUpdateKyc()
    const [adharaFile, setAdharaFile] = useState(null)
    const [panFile, setPanFile] = useState(null)




    //handel update kyc
    const handleKycUpdate = async () => {
        if (!adharaFile && !panFile) {
            Swal.fire("No Files", "Please select Aadhaar or PAN file to update.", "info")
            return
        }

        const result = await updateKyc(adharaFile, panFile, getaccesstoken)

        if (result?.success) {
            Swal.fire("Success", "KYC documents updated successfully!", "success")
            // 🔁 Optionally refresh the user profile after successful update
            const refreshed = await getLoggedinuser(getaccesstoken)
            if (refreshed.data?.user) setProfile(refreshed.data.user)
            setAdharaFile(null)
            setPanFile(null)
        } else {
            Swal.fire("You Can't Uplode", uploadError || "Failed to update KYC", "error")
        }
    }



    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            if (!getaccesstoken) return
            setLoading(true)
            try {
                const res = await getLoggedinuser(getaccesstoken)
                if (res.data && res.data.user) {
                    setProfile(res.data.user)
                } else {
                    setError("No profile data found")
                }
            } catch (err) {
                console.error(err)
                setError("Failed to fetch profile")
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [getaccesstoken])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (formRef.current && !formRef.current.contains(e.target)) {
                setIsEditing(false)
                setModified(false)
            }
        }

        if (isEditing) {
            document.addEventListener("mousedown", handleClickOutside)
        } else {
            document.removeEventListener("mousedown", handleClickOutside)
        }

        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isEditing])

    const handleChange = (e) => {
        const { name, value } = e.target
        setProfile((prev) => (prev ? { ...prev, [name]: value } : null))
        setModified(true)
    }

    const handleSave = async () => {
        if (!modified || !profile) return
        try {
            const updatedUser = await editUser({
                name: profile.name,
                email: profile.email,
                mobno: profile.mobno,
            })
            setProfile(updatedUser)
            setIsEditing(false)
            setModified(false)
        } catch (err) {
            console.error("Failed to save profile:", err)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-4 border-slate-300 border-t-blue-800 animate-spin mx-auto mb-4" style={{ borderTopColor: PRIMARY_NAVY }}></div>
                    <p className="text-slate-600 font-medium">Loading profile...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600 font-medium">
                {error}
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-600 font-medium">
                No profile data available
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Card */}
                <div className="relative mb-8 rounded-2xl overflow-hidden shadow-xl bg-white">
                    <div className="h-32 sm:h-48 relative"
                        style={{
                            background: `linear-gradient(90deg, ${PRIMARY_NAVY}, ${PRIMARY_NAVY}CC)`,
                        }}></div>
                    <div className="px-6 sm:px-8 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 relative z-10 mb-6">
                            <div className="w-32 h-32 rounded-2xl shadow-lg flex items-center justify-center text-white text-4xl font-bold border-4 border-white"
                                style={{
                                    backgroundColor: PRIMARY_NAVY
                                }}
                            >
                                {profile.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1
                                        className="text-3xl sm:text-4xl font-bold px-3 py-1 rounded-md"
                                        style={{
                                            backgroundColor: ACCENT_YELLOW_BUTTON,
                                            color: "#1e293b" // dark text for contrast
                                        }}
                                    >
                                        {profile.name}
                                    </h1>
                                    {profile.verified && (
                                        <BadgeCheck className="w-8 h-8" style={{ color: ICON_COLOR_CONTACT }} />
                                    )}
                                </div>

                                <p className="text-slate-600 mb-3">Member ID: {profile.memId}</p>
                            </div>

                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                style={{
                                    backgroundColor: ACCENT_YELLOW_BUTTON,
                                    color: PRIMARY_NAVY,
                                    transition: 'background-color 0.3s ease-in-out',
                                }}
                                className="self-start sm:self-center px-6 py-2 rounded-lg hover:bg-[#FFD966] transition font-semibold flex items-center gap-2 shadow-md"
                            >
                                {isEditing ? (
                                    <>
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <Edit2 className="w-4 h-4" />
                                        Edit Profile
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pt-6 border-t border-slate-200">
                            <div>
                                <p className="text-sm text-slate-600">Joined</p>
                                <p className="font-semibold text-slate-900">
                                    {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Plan</p>
                                <p className="font-semibold text-slate-900">{profile.plan?.plan_name || "Standard"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Referrals</p>
                                <p className="font-semibold text-slate-900">{profile.referralCount ?? 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editable Form & Details */}
                <div ref={formRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left - Contact & Social */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Mail className="w-5 h-5" style={{ color: ICON_COLOR_CONTACT }} /> Contact
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Email</p>
                                    <a href={`mailto:${profile.email}`}
                                        className="font-medium break-all transition"
                                        style={{ color: PRIMARY_NAVY }}
                                    >
                                        {profile.email}
                                    </a>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Phone</p>
                                    <a href={`tel:${profile.mobno}`}
                                        className="font-medium transition"
                                        style={{ color: PRIMARY_NAVY }}
                                    >
                                        {profile.mobno}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Account, Plan, Tracking & KYC */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Account Details */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5" style={{ color: ICON_COLOR_CONTACT }} /> Account Details
                                </h2>
                                {isEditing && modified && (
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        style={{ backgroundColor: PRIMARY_NAVY }}
                                        className="px-4 py-2 rounded-lg text-white hover:bg-blue-800 transition font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
                                    </button>
                                )}
                            </div>

                            {saveError && <p className="text-red-600 mb-2">{saveError}</p>}
                            {successMsg && <p className="text-green-700 mb-2">{successMsg}</p>}

                            <div className="space-y-4">
                                {["name", "email", "mobno"].map((field) => (
                                    <div key={field}>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 capitalize">
                                            {field === "mobno" ? "Mobile Number" : field}
                                        </label>
                                        <input
                                            type={field === "email" ? "email" : "text"}
                                            name={field}
                                            value={profile[field] || ""}
                                            onChange={handleChange}
                                            readOnly={!isEditing}
                                            className={`w-full px-4 py-2 rounded-lg font-medium transition ${isEditing
                                                ? `bg-slate-50 border-2 border-[${PRIMARY_NAVY}] focus:outline-none focus:border-blue-700`
                                                : "bg-slate-50 border border-slate-200 text-slate-700 cursor-default"
                                                }`}
                                            style={isEditing ? { borderColor: modified ? ICON_COLOR_CONTACT : PRIMARY_NAVY } : {}}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Plan & Tracking */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg p-6 border border-blue-200">
                                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" style={{ color: ICON_COLOR_CONTACT }} /> Your Plan
                                </h3>
                                <p className="text-3xl font-bold mb-2" style={{ color: PRIMARY_NAVY }}>{profile.plan?.plan_name || "Standard"}</p>
                                <p className="text-sm" style={{ color: PRIMARY_NAVY }}>Active subscription</p>
                            </div>

                            {profile.trackingId && (
                                <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl shadow-lg p-6 border border-amber-200">
                                    <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <Eye className="w-5 h-5" style={{ color: PRIMARY_NAVY }} /> Tracking ID
                                    </h3>
                                    <p className="text-2xl font-mono font-bold break-all" style={{ color: PRIMARY_NAVY }}>{profile.trackingId}</p>
                                    <p className="text-sm text-gray-700 mt-2">Use for support inquiries</p>
                                </div>
                            )}
                        </div>

                        {/* KYC Documents */}
                        {/* KYC Documents Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5" style={{ color: ICON_COLOR_CONTACT }} /> KYC Documents
                            </h2>

                            {/* 🔹 KYC Status */}
                            <div className="flex items-center justify-between mb-6 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                <p className="font-semibold text-slate-800 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-indigo-600" />
                                    KYC Status:
                                </p>
                                {profile.kyc?.status ? (
                                    <span
                                        className={`px-3 py-1.5 rounded-full text-sm font-semibold
          ${profile.kyc.status === "approved"
                                                ? "bg-green-100 text-green-700 border border-green-300"
                                                : profile.kyc.status === "rejected"
                                                    ? "bg-red-100 text-red-700 border border-red-300"
                                                    : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                            }`}
                                    >
                                        {profile.kyc.status.charAt(0).toUpperCase() + profile.kyc.status.slice(1)}
                                    </span>
                                ) : (
                                    <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-600 border border-gray-300">
                                        Not Submitted
                                    </span>
                                )}
                            </div>

                            {/* 🔹 Documents */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                {/* Aadhaar Document */}
                                <div className="border-2 border-slate-200 rounded-xl p-4 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <IdCard className="w-6 h-6" style={{ color: PRIMARY_NAVY }} />
                                        <div>
                                            <p className="font-semibold text-slate-900">Aadhaar Card</p>
                                            {profile.kyc?.adhara_img ? (
                                                <a
                                                    href={profile.kyc.adhara_img}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-sm font-medium hover:underline"
                                                    style={{ color: ICON_COLOR_CONTACT }}
                                                >
                                                    View Current
                                                </a>
                                            ) : (
                                                <p className="text-sm text-gray-500">No document uploaded</p>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setAdharaFile(e.target.files[0])}
                                        className="mt-2 text-sm"
                                    />
                                </div>

                                {/* PAN Document */}
                                <div className="border-2 border-slate-200 rounded-xl p-4 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <IdCard className="w-6 h-6" style={{ color: PRIMARY_NAVY }} />
                                        <div>
                                            <p className="font-semibold text-slate-900">PAN Card</p>
                                            {profile.kyc?.pan_img ? (
                                                <a
                                                    href={profile.kyc.pan_img}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-sm font-medium hover:underline"
                                                    style={{ color: ICON_COLOR_CONTACT }}
                                                >
                                                    View Current
                                                </a>
                                            ) : (
                                                <p className="text-sm text-gray-500">No document uploaded</p>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setPanFile(e.target.files[0])}
                                        className="mt-2 text-sm"
                                    />
                                </div>
                            </div>

                            {/* 🔹 Update Button */}
                            {/* 🔹 Update Button — hide when status is approved */}
                            {profile.kyc?.status !== "approved" && (
                                <>
                                    <button
                                        onClick={handleKycUpdate}
                                        disabled={uploading}
                                        className={`w-full sm:w-auto px-6 py-2 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2 ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                                            }`}
                                    >
                                        {uploading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" /> Update Documents
                                            </>
                                        )}
                                    </button>

                                    {uploadError && <p className="text-red-600 mt-3 text-sm">{uploadError}</p>}
                                    {success && <p className="text-green-600 mt-3 text-sm">Documents updated successfully!</p>}
                                </>
                            )}


                            {uploadError && <p className="text-red-600 mt-3 text-sm">{uploadError}</p>}
                            {success && <p className="text-green-600 mt-3 text-sm">Documents updated successfully!</p>}
                        </div>

                    </div>
                </div>
            </div>
        </main>
    )
}
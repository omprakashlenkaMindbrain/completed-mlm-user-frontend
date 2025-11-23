// components/MemberIdShare.jsx
import { Facebook, Instagram, Mail, Send, Share2, Twitter, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Swal from "sweetalert2"

export default function MemberIdShare({ memId, username }) {
    const [shareVisible, setShareVisible] = useState(false)
    const shareRef = useRef(null)

    // Close share popup if click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (shareRef.current && !shareRef.current.contains(event.target)) {
                setShareVisible(false)
            }
        }
        if (shareVisible) {
            document.addEventListener("mousedown", handleClickOutside)
        } else {
            document.removeEventListener("mousedown", handleClickOutside)
        }
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [shareVisible])

    const copyText = (side) => {
        const trackingId = `${memId}-${side}`;

        navigator.clipboard.writeText(trackingId).then(() => {
            Swal.fire({
                icon: "success",
                title: "Tracking ID Copied!",
                text: "", // no extra message
                timer: 1500,
                showConfirmButton: false,
            });
        });
    };


    const copyUrl = () => {
        const url = window.location.href
        navigator.clipboard.writeText(url).then(() => {
            Swal.fire({
                icon: "success",
                title: "Copied!",
                text: `Profile URL copied to clipboard`,
                timer: 1200,
                showConfirmButton: false,
            })
        })
    }

    const url = window.location.href
    const shareText = `Check out this profile with member ID: ${memId}`

    const socialShares = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + " " + url)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        telegram: `https://telegram.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
        instagram: null,
        gmail: `mailto:?subject=Profile&body=${encodeURIComponent(shareText + " " + url)}`,
    }

    const handleShareClick = (platform) => {
        if (platform === "instagram") {
            navigator.clipboard.writeText(url)
            setShareVisible(false)
            return
        }
        const shareUrl = socialShares[platform]
        if (shareUrl) {
            window.open(shareUrl, "_blank", "noopener,noreferrer")
            setShareVisible(false)
        }
    }

    const tryNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: "Profile share", text: shareText, url })
            } catch {
                setShareVisible(true)
            }
        } else {
            setShareVisible(true)
        }
    }

    return (
        <div className="flex flex-wrap items-center gap-3 font-sans select-none w-full">
            <span className="text-gray-700 font-semibold">Member ID:</span>
            <span className="font-bold text-primary">{memId}</span>

            {/* Left Button */}
            <button
                onClick={() => copyText("left")}
                className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition font-semibold focus:outline focus:outline-2 focus:outline-blue-400"
            >
                Left
            </button>

            {/* Right Button */}
            <button
                onClick={() => copyText("right")}
                className="px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 transition font-semibold focus:outline focus:outline-2 focus:outline-green-400"
            >
                Right
            </button>

            <div className="relative" ref={shareRef}>
                <button
                    onClick={() => {
                        if (shareVisible) setShareVisible(false)
                        else tryNativeShare()
                    }}
                    className="p-2 rounded-full hover:bg-slate-200 transition focus:outline focus:outline-2 focus:outline-primary"
                >
                    <Share2 className="w-5 h-5 text-primary" />
                </button>

                {/* SHARE POPUP (Responsive) */}
                {shareVisible && (
                    <div
                        className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg p-3 
                       flex flex-col gap-2 z-50 w-48 sm:w-64 transition"
                        role="menu"
                    >
                        <button
                            onClick={() => copyUrl()}
                            className="p-2 rounded hover:bg-gray-200 text-gray-600 flex items-center gap-2 font-semibold text-sm"
                        >
                            Copy URL <Mail className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => handleShareClick("whatsapp")}
                            className="p-2 rounded hover:bg-green-100 flex items-center gap-2"
                        >
                            WhatsApp
                            <span className="text-green-600 font-bold text-lg">🟢</span>
                        </button>

                        <button
                            onClick={() => handleShareClick("instagram")}
                            className="p-2 rounded hover:bg-pink-100 flex items-center gap-2"
                        >
                            Instagram <Instagram className="w-5 h-5 text-pink-600" />
                        </button>

                        <button
                            onClick={() => handleShareClick("twitter")}
                            className="p-2 rounded hover:bg-blue-100 flex items-center gap-2"
                        >
                            Twitter <Twitter className="w-5 h-5 text-blue-600" />
                        </button>

                        <button
                            onClick={() => handleShareClick("telegram")}
                            className="p-2 rounded hover:bg-blue-200 flex items-center gap-2"
                        >
                            Telegram <Send className="w-5 h-5 text-blue-500" />
                        </button>

                        <button
                            onClick={() => handleShareClick("facebook")}
                            className="p-2 rounded hover:bg-blue-300 flex items-center gap-2"
                        >
                            Facebook <Facebook className="w-5 h-5 text-blue-700" />
                        </button>

                        <button
                            onClick={() => handleShareClick("gmail")}
                            className="p-2 rounded hover:bg-red-100 flex items-center gap-2"
                        >
                            Gmail <Mail className="w-5 h-5 text-red-600" />
                        </button>

                        <button
                            onClick={() => setShareVisible(false)}
                            className="p-2 rounded hover:bg-gray-200 text-gray-600 flex items-center justify-center"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

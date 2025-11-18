"use client"

import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

export default function HeroSection() {
  const PRIMARY_NAVY = "#1B436D"
  const BUTTON = "#fdbb2d"

  const navigate = useNavigate()
  const navigateToJoin = () => navigate("/kyc")

  return (
    <section className="px-6 py-14 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 relative z-10">
      <motion.div
        className="flex-1 flex justify-center items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/3050/3050159.png"
          alt="Medicine Capsule"
          className="w-56 h-56 object-contain"
        />
      </motion.div>
      <div className="flex-1 text-center lg:text-left">
        <h1
          className="text-3xl sm:text-4xl font-extrabold mb-4 leading-snug drop-shadow-md"
          style={{ color: PRIMARY_NAVY }}
        >
          Grow Your Income with BMPL MLM Platform
        </h1>
        <p className="text-gray-700 mb-6 text-base sm:text-lg max-w-lg mx-auto lg:mx-0">
          Join our thriving network and start earning instantly. Build your team, unlock bonuses, and watch your
          business grow.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 rounded-xl font-bold text-lg transition shadow-xl"
          onClick={navigateToJoin}
          style={{
            backgroundColor: BUTTON,
            color: PRIMARY_NAVY,
            boxShadow: "0 4px 6px rgba(0, 74, 173, 0.2)",
            cursor: "pointer",
          }}
        >
          Join Now
        </motion.button>
      </div>
    </section>
  )
}

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Amit Sharma",
    role: "Affiliate Partner",
    message:
      "BMPL Mall completely changed my income journey. The dashboard is smooth and the referral system is very transparent.",
  },
  {
    name: "Priya Verma",
    role: "Team Leader",
    message:
      "The platform is beginner-friendly and earnings are tracked clearly. The support team is amazing!",
  },
  {
    name: "Rohit Kumar",
    role: "Distributor",
    message:
      "I was able to build a strong network and earn commissions regularly. The system is simple and effective.",
  },
];

export default function HowItWorks() {
  const [current, setCurrent] = useState(0);

  // Auto Slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fadeVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-14 relative z-10">
      <h2
        className="text-3xl sm:text-4xl font-extrabold mb-12 text-center"
        style={{ color: "#004aad" }}
      >
        What Our Partners Say
      </h2>

      <div className="relative flex justify-center">
        <motion.div
          key={current}
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          className="bg-white max-w-xl w-full p-8 rounded-3xl shadow-xl border border-gray-200 text-center"
        >
          <p className="text-gray-700 text-lg italic mb-6">
            "{testimonials[current].message}"
          </p>

          <h3
            className="text-xl font-semibold"
            style={{ color: "#004aad" }}
          >
            {testimonials[current].name}
          </h3>
          <p className="text-gray-500 text-sm">{testimonials[current].role}</p>

          {/* Dots */}
          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === current ? "bg-[#004aad]" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

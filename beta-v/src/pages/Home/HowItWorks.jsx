import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const steps = [
  {
    title: "Sign Up",
    text: "Create your free account to get started as an affiliate with BMPL.",
    icon: "📝",
  },
  {
    title: "Build Network",
    text: "Invite others, build your team, and grow your business organically.",
    icon: "👥",
  },
  {
    title: "Earn Commissions",
    text: "Easily track your earnings and rewards through our secure dashboard.",
    icon: "💰",
  },
];

export default function HowItWorks() {


  const PRIMARY_NAVY="#1B436D"



  const directions = ["left", "top", "right"];

  const cardVariants = {
    hidden: (direction) => {
      switch (direction) {
        case "left":
          return { opacity: 0, x: -80, y: 0 };
        case "right":
          return { opacity: 0, x: 80, y: 0 };
        case "top":
          return { opacity: 0, y: -80, x: 0 };
        default:
          return { opacity: 0, y: 80, x: 0 };
      }
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.9, ease: "easeOut" },
    },
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-14 relative z-10">
      <h2
        className="text-3xl sm:text-4xl font-extrabold mb-12 text-center"
        // Apply Deep Blue Primary Color
        style={{ color: PRIMARY_NAVY }}
      >
        How It Works
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, idx) => {
          const controls = useAnimation();
          const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

          useEffect(() => {
            if (inView) controls.start("visible");
          }, [inView, controls]);

          let circleGradient;
          if (idx === 0) {
            circleGradient = "from-[#00bfa6] via-[#00e3cd] to-[#00bfa6]";
          } else if (idx === 1) {
            circleGradient = "from-[#fdbb2d] via-[#fceb86] to-[#fdbb2d]";
          } else {
            circleGradient = "from-[#004aad] via-[#0069e2] to-[#004aad]";
          }

          return (
            <motion.div
              key={idx}
              ref={ref}
              className="bg-white rounded-3xl p-8 flex flex-col items-center text-center relative shadow-lg hover:shadow-2xl transition-transform duration-500 hover:scale-105 border border-gray-200"
              custom={directions[idx % directions.length]}
              variants={cardVariants}
              initial="hidden"
              animate={controls}
              transition={{
                type: "spring",
                stiffness: 60,
                damping: 15,
                delay: idx * 0.2,
              }}
            >
              <motion.div
                className="text-5xl mb-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {step.icon}
              </motion.div>

              <div 
                className={`mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r ${circleGradient} text-white font-bold text-xl shadow-lg animate-pulse`}
              >
                {idx + 1}
              </div>

              <h3 
                className="text-xl font-semibold mb-2"
                style={{ color: "#004aad" }} 
              >
                {step.title}
              </h3>
              <p className="text-gray-600 text-base">{step.text}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
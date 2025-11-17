import { motion } from "framer-motion";
import Footer from "../../components/Footer";
import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import TestimonialsSection from "./TestimonialsSection";

export default function Home() {

  const bgLight = "#f8fafc"; 
  const primaryColor = "#004aad";

  console.log("hii");
  

  return (
    <div className="relative min-h-screen overflow-hidden">
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ backgroundColor: primaryColor, opacity: 0 }} 
        whileInView={{ backgroundColor: bgLight, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
      />

      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <TestimonialsSection />

      <Footer />


    </div>
  );
}
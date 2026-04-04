import { motion, AnimatePresence } from "framer-motion";

export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const pageTransition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.3,
};

export function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08 },
  },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export { AnimatePresence };
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SmoothWrapperProps {
    children: ReactNode;
}

export function SmoothWrapper({ children }: SmoothWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1] // Custom ease-out expo for premium feel
            }}
        >
            {children}
        </motion.div>
    );
}

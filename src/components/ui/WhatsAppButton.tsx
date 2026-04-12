"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  // Use the verified phone number (581) 745-7409
  const phoneNumber = "15817457409";
  const message = "Bonjour Vicky ! J'aimerais avoir des informations sur vos services ou prendre un rendez-vous coiffure.";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 p-3 sm:p-4 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center group"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 whitespace-nowrap text-sm font-medium">
        WhatsApp
      </span>
      {/* Pulse effect */}
      <motion.span
        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-[#25D366] -z-10"
      />
    </motion.a>
  );
}

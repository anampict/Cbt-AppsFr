"use client";

import { useEffect } from "react";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";

const LoginSuccessToast = () => {
  useEffect(() => {
    // Check if user just logged in
    if (typeof window !== "undefined") {
      const loginSuccess = sessionStorage.getItem("loginSuccess");
      if (loginSuccess === "true") {
        // Show success toast
        toast.push(
          <Notification type="success">Login berhasil!</Notification>,
          {
            placement: "top-center",
          }
        );
        // Clear the flag
        sessionStorage.removeItem("loginSuccess");
      }
    }
  }, []);

  return null;
};

export default LoginSuccessToast;

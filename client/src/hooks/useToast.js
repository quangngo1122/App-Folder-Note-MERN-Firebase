import { useState } from "react";

export const useToast = () => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success", // success, error, warning, info
  });

  const showToast = (message, severity = "success") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const closeToast = () => {
    setToast({
      ...toast,
      open: false,
    });
  };

  return {
    toast,
    showToast,
    closeToast,
  };
};

import React, { createContext, useContext, useState, useCallback } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, message: "", variant: "" });

  const showToast = useCallback((message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ show: false, message: "", variant: "" }), 5000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <ToastContainer
        position="top-right"
        className="p-3"
        style={{ zIndex: 9999, position: "fixed", top: "50px", right: "0px" }}
      >
        <Toast show={toast.show} bg={toast.variant}>
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </ToastContext.Provider>
  );
};

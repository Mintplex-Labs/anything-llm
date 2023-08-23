import { toast } from "react-toastify";
import usePrefersDarkMode from "../hooks/usePrefersDarkMode";

const showToast = (message, type = "default") => {
  const prefersDarkMode = usePrefersDarkMode();
  const options = {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: prefersDarkMode ? "dark" : "light",
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    case "warning":
      toast.warn(message, options);
      break;
    default:
      toast(message, options);
  }
};

export default showToast;

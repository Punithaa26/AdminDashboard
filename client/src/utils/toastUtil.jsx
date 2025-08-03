import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showSuccessToast = (message) => {
  toast.success(
    <div className="flex items-center gap-2 text-green-400">
      <span>{message}</span>
    </div>,
    {
      style: {
        background: "rgba(43, 42, 42, 1)",
        border: "1px solid #d2c5c5ff", // Tailwind's green-500
        color: "#19b819ff",
      },
    }
  );
};

export const showErrorToast = (message) => {
  toast.error(
    <div className="flex items-center gap-2 text-red-400">
       <span>{message}</span>
    </div>,
    {
      style: {
        background: "rgba(43, 42, 42, 1)",
        border: "1px solid #d2c5c5ff", // Tailwind's red-500
        color: "#ef4444",
      },
    }
  );
};

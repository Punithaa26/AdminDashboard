import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showSuccessToast = (message) => {
  toast.success(
    <div className="flex items-center gap-2 text-green-400">
      <span>{message}</span>
    </div>,
    {
      style: {
        background: "#000",
        border: "1px solid #22c55e", // Tailwind's green-500
        color: "#22c55e",
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
        background: "#000",
        border: "1px solid #ef4444", // Tailwind's red-500
        color: "#ef4444",
      },
    }
  );
};

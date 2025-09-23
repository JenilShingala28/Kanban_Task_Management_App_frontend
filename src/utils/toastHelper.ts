import { Bounce, toast } from "react-toastify";

export const showErrorToast = (message: string) => {
  toast.error(message || "Something went wrong!", {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    transition: Bounce,
    theme: "colored",
  });
};

export const showSuccessToast = (message: string) => {
  toast.success(message || "Success!", {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    transition: Bounce,
    theme: "colored",
  });
};

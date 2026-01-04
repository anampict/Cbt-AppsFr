import type { AxiosError } from "axios";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import isBrowser from "@/utils/isBrowser";

const AxiosResponseIntrceptorErrorCallback = (error: AxiosError) => {
  /** handle response error here */
  console.error("error", error);

  // Handle 401 Unauthorized errors globally (only in browser)
  if (isBrowser && error.response?.status === 401) {
    toast.push(
      <Notification type="warning">
        Sesi login anda sudah habis, silahkan logout dan login kembali
      </Notification>,
      {
        placement: "top-center",
      }
    );
  }
};

export default AxiosResponseIntrceptorErrorCallback;

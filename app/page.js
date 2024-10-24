import Image from "next/image";
import MultiStepForm from "./components/MultiStepForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <div>
      <MultiStepForm />
      {/* Toastify Notification */}
      <ToastContainer />
    </div>
  );
}

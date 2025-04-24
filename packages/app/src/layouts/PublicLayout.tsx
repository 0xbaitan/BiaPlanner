import { HTMLAttributes } from "react";
import { ToastContainer } from "react-toastify";

export type PublicLayoutProps = HTMLAttributes<HTMLDivElement>;
export default function PublicLayout(props: PublicLayoutProps) {
  const { children, className, ...rest } = props;

  return (
    <div {...rest} className={`flex flex-col items-center justify-center h-screen bg-gray-100 ${className ? ` ${className}` : ""}`}>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss />
      {children}
    </div>
  );
}

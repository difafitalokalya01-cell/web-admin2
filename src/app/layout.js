import { ToastContainer } from "react-toastify";
import "../styles/globals.css";

export const metadata = {
  title: "Tiktok Task Admin Panel",
  description: "Dashboard untuk mengelola data dan tugas dari Tiktok Task.",
  keywords: ["Next.js", "Dashboard", "Admin Panel", "Tiktok Task"],
  authors: [{ name: "Tiktok.com" }],
  openGraph: {
    title: "Tiktok Task Admin Panel",
    description: "Kelola data & task dengan mudah di Tiktok Task Admin Panel.",
    url: "https://tiktok-task-admin.vercel.app",
    siteName: "Tiktok Task Admin",
    images: [
      {
        url: "/images/preview.png",
        width: 1200,
        height: 630,
        alt: "Tiktok Task Dashboard Preview",
      },
    ],
    locale: "id_ID",  
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"/>  
      </body>
    </html>
  );
}

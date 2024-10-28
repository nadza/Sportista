"use client";

import { usePathname } from 'next/navigation';
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";

export default function LayoutWithNavFooter({ children }) {
  const pathname = usePathname(); 
  const noNavFooterPaths = ["/login", "/registration"]; 
  const showNavFooter = !noNavFooterPaths.includes(pathname); 

  return (
    <>
      {showNavFooter && <Navbar />} {/* Conditionally render Navbar */}
      {children}
      {showNavFooter && <Footer />} {/* Conditionally render Footer */}
    </>
  );
}

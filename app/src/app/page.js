"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Footer from "./components/footer/footer";
import Navbar from "./components/navbar/navbar";
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.href = "/login"; // Redirect to the /login route
    }
  }, []);
  return ( null );
}

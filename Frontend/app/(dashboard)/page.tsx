"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('user');
    let user: unknown;

    try {
      user = data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      user = null; // Fallback if JSON is invalid
    }

    if (!isUser(user)) {
      router.push('/login');
    }
  }, [router]);

  const isUser = (data: unknown): data is Record<string, unknown> => {
    return typeof data === 'object' && data !== null; // Basic validation for objects
  };

  return (
    <div>
      <h1>Welcome to Home Page</h1>
      {/* Your page content */}
    </div>
  );
}

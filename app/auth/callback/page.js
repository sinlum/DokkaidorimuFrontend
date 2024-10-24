"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/_components/userContext";
import { ScaleLoader } from "react-spinners";

export default function AuthCallback() {
  const router = useRouter();
  const { fetchUser } = useUser();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        try {
          localStorage.setItem("token", token);
          await fetchUser(token);
          router.push("/");
        } catch (error) {
          console.error("Error during authentication:", error);
          router.push("/signin");
        }
      } else {
        console.error("No token received");
        router.push("/signin");
      }
    };

    handleCallback();
  }, [router, fetchUser]);

  return (
    <div className="flex justify-center items-center h-screen">
      <ScaleLoader color="#FF7F3E" height={35} width={5} />
    </div>
  );
}

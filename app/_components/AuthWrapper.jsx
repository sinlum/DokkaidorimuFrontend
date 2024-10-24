// app/_components/AuthWrapper.js
"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "./userContext";
import ClientWrapper from "./ClientWrapper";

export default function AuthWrapper({ children }) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user && !["/signin", "/signup"].includes(pathname)) {
        router.push("/signin");
      }
      setIsAuthChecked(true);
    }
  }, [user, isLoading, pathname]);

  if (isLoading || !isAuthChecked) {
    return <div>Loading...</div>; // You can replace this with a loading spinner
  }

  if (!user && !["/signin", "/signup"].includes(pathname)) {
    return null; // This will prevent the children from rendering while redirecting
  }

  if (["/signin", "/signup"].includes(pathname)) {
    return <div className="min-h-screen w-full">{children}</div>; // Full-screen wrapper for auth pages
  }

  return <ClientWrapper>{children}</ClientWrapper>;
}

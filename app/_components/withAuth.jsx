// components/withAuth.js
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./userContext";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/signin");
      }
    }, [user, loading]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;

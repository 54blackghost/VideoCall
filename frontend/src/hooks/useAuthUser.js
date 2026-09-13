import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/react";
import { syncClerkUser } from "../lib/clerkApi";

const useAuthUser = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user: clerkUser } = useUser();

  const authUser =useQuery({
  queryKey: ["friends"],
  queryFn: () => getUserFriends(getToken),
});

  return {
    isLoading:
      !isLoaded ||
      (isSignedIn && authUser.isLoading),

    authUser: authUser.data?.user || null,

    clerkUser,

    isSignedIn,
  };
};

export default useAuthUser;
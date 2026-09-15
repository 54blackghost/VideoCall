
import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/react";
import { syncClerkUser } from "../lib/clerkApi";

const useAuthUser = () => {
  const {
    isLoaded: isAuthLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  const {
    user: clerkUser,
    isLoaded: isUserLoaded,
  } = useUser();

  const authUserQuery = useQuery({
    queryKey: ["authUser", clerkUser?.id],

    queryFn: () => syncClerkUser(getToken),

    enabled:
      isAuthLoaded &&
      isUserLoaded &&
      Boolean(isSignedIn) &&
      Boolean(clerkUser?.id),

    retry: false,
  });

  const isLoading =
    !isAuthLoaded ||
    !isUserLoaded ||
    (isSignedIn && authUserQuery.isLoading);

  return {
    isLoading,

    // Authentification Clerk
    isSignedIn: Boolean(isSignedIn),

    // Utilisateur Clerk
    clerkUser,

    // Utilisateur MongoDB
    authUser: authUserQuery.data?.user || null,

    // Permet de diagnostiquer une erreur de synchronisation
    authError: authUserQuery.error || null,
  };
};

export default useAuthUser;


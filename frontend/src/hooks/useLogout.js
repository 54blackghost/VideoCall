import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { logout } from '../lib/api';

const useLogout = () => {

    const queryClient = useQueryClient();
    const { mutate: logoutMutation, isPending, error  } = useMutation({
        mutationFn:logout,
        onSuccess: () =>  {
      console.log("✅ Déconnexion réussie");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      // Optionnel : rediriger après logout
      // window.location.href = '/login';
    },
     onError: (error) => {
      console.error("❌ Erreur lors de la déconnexion:", error);
    },
    });
    return {logoutMutation,isPending, error, };
 
};

export default useLogout;

 


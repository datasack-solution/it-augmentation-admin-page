import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useCookies } from "react-cookie";
import { Admin,adminApi } from "./adminApi";
import { useRouter } from "next/navigation";

interface AxiosErrorType {
  message: string,
  success: boolean
}

export const useAuthUser = () => {
  const queryClient = useQueryClient();
  const router = useRouter()

  return useMutation<
  AxiosResponse<{ message: string, success: boolean, user: Admin }, AxiosError<AxiosErrorType>>, 
  AxiosError<AxiosErrorType>, 
  string,
  unknown
  >(
    'authenticateUser', 
    (token:string)=> adminApi.authToken(token),
    {
      onSuccess: () => {
        console.log("success on user auth")
        queryClient.invalidateQueries('userDetails');
      },
      onError: (e) => {
        console.log("Error during authentication", e);
        router.push('/login')
      }
    }
  );
};

export const useSignOutUser = () => {
  const [, , removeCookie] = useCookies(['token']);
  return () => {
    removeCookie('token');
    window.location.href='/login'
  };
};


interface OTPPayload {
  email: string,
  accountVerification: boolean
}

export const useSendOTPMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: OTPPayload) => adminApi.sendOTP(payload.email, payload.accountVerification),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('userclient');
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on sending otp: ", e)
      }
    }
  )
}

interface VerifyOTPPayload{
  email:string,
  otp:string
}

export const useVerifyOTPMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: VerifyOTPPayload) => adminApi.verifyOTP(payload.email, payload.otp),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('userclient');
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on verifying otp: ", e)
      }
    }
  )
}

export const useEmailSigninMutation = (validatePassword:boolean) => {
  const queryClient = useQueryClient();
  const router = useRouter()

  return useMutation(
    (user: Admin) => adminApi.login(user),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('userLogin');
        if (!validatePassword){
          localStorage.setItem('token',data.data.token)
        }
        setTimeout(() => {
          router.push('/')
        }, 1000)
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on onLogin", e);
      }
    }
  );
};


export const useEmailSignUpMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter()

  return useMutation(
    (user: Admin) => adminApi.createAdmin(user),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('userLogin');
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on on create admin", e);
      }
    }
  );
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter()

  return useMutation(
    (user: Admin) => adminApi.updateAdmin(user),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('userDetails');
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on on update admin", e);
      }
    }
  );
};

export const useDeleteAdminMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter()

  return useMutation(
    (email:string ) => adminApi.deleteAdmin(email),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('userDetails');
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on on delete admin", e);
      }
    }
  );
};

export const useGetUsers = (refetchInterval?: number) => {
  return  useQuery({
      queryKey: ['userDetails'],
      queryFn: async () => {
        const res =await adminApi.getAllUsers()
        return res
      },
      onError:(e:AxiosError<AxiosErrorType>)=>e,
      refetchInterval,
    })
}

export const useResetPasswordMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter()

  return useMutation(
    (payload:{email:string,password:string}) => adminApi.resetPassword(payload.email,payload.password),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('userDetails');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      },
      onError: (e: AxiosError<AxiosErrorType>) => {
        console.log("error on reset password", e);
      }
    }
  );
};


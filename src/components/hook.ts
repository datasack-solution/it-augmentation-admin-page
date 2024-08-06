import { ClientRecord } from "@/util/util";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { clientApi } from "./clientApi";
import { AxiosError } from "axios";


interface AxiosErrorType{
  message:string,
  error:Error
}


export const useGetClientRecords = (refetchInterval?: number) => {
    return  useQuery({
        queryKey: ['clientRecords'],
        queryFn: async () => {
          const res =await clientApi.getClients()
          return res
        },
        onError:(e:AxiosError<AxiosErrorType>)=>e,
        refetchInterval,
      })
  }
 

    
  export const useUpdateClientMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation(
      (clientRecord: ClientRecord) => clientApi.updateClient(clientRecord),
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries('clientRecords');
          console.log("on update mutation success: ", data);
        },
        onError: (e: AxiosError<AxiosErrorType>) => {
          console.log("error on update client record", e);
        }
      }
    );
  };


  export const useDeleteClientMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation(
      (payload: string) => clientApi.deleteClient(payload),
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries('clientRecords');
          console.log("on delete mutation success: ", data);
        },
        onError: (e: AxiosError<AxiosErrorType>) => {
          console.log("error on delete client record", e);
        }
      }
    );
  };

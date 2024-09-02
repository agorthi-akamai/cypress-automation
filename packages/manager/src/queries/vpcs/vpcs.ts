import {
  CreateSubnetPayload,
  CreateVPCPayload,
  ModifySubnetPayload,
  Subnet,
  UpdateVPCPayload,
  VPC,
  createSubnet,
  createVPC,
  deleteSubnet,
  deleteVPC,
  getSubnet,
  getSubnets,
  getVPC,
  getVPCs,
  modifySubnet,
  updateVPC,
} from '@linode/api-v4';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { getAllVPCsRequest } from './requests';

import type {
  APIError,
  Filter,
  Params,
  ResourcePage,
} from '@linode/api-v4/lib/types';

// VPC queries
export const vpcQueries = createQueryKeys('vpcs', {
  all: {
    queryFn: getAllVPCsRequest,
    queryKey: null,
  },
  paginated: (params: Params = {}, filter: Filter = {}) => ({
    queryFn: () => getVPCs(params, filter),
    queryKey: [params, filter],
  }),
  vpc: (vpcId: number) => ({
    contextQueries: {
      subnets: {
        contextQueries: {
          paginated: (params: Params = {}, filter: Filter = {}) => ({
            queryFn: () => getSubnets(vpcId, params, filter),
            queryKey: [params, filter],
          }),
          subnet: (subnetId: number) => ({
            queryFn: () => getSubnet(vpcId, subnetId),
            queryKey: [subnetId],
          }),
        },
        queryKey: null,
      },
    },
    queryFn: () => getVPC(vpcId),
    queryKey: [vpcId],
  }),
});

export const useAllVPCsQuery = (enabled = true) =>
  useQuery<VPC[], APIError[]>({
    ...vpcQueries.all,
    enabled,
  });

export const useVPCsQuery = (
  params: Params,
  filter: Filter,
  enabled = true
) => {
  return useQuery<ResourcePage<VPC>, APIError[]>({
    ...vpcQueries.paginated(params, filter),
    enabled,
    placeholderData: keepPreviousData,
  });
};

export const useVPCQuery = (id: number, enabled: boolean = true) =>
  useQuery<VPC, APIError[]>({
    ...vpcQueries.vpc(id),
    enabled,
  });

export const useCreateVPCMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<VPC, APIError[], CreateVPCPayload>({
    mutationFn: createVPC,
    onSuccess(vpc) {
      queryClient.invalidateQueries({
        queryKey: vpcQueries.all.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: vpcQueries.paginated._def,
      });
      queryClient.setQueryData<VPC>(vpcQueries.vpc(vpc.id).queryKey, vpc);
    },
  });
};

export const useUpdateVPCMutation = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<VPC, APIError[], UpdateVPCPayload>({
    mutationFn: (data) => updateVPC(id, data),
    onSuccess(vpc) {
      queryClient.invalidateQueries({
        queryKey: vpcQueries.paginated._def,
      });
      queryClient.setQueryData<VPC>(vpcQueries.vpc(vpc.id).queryKey, vpc);
    },
  });
};

export const useDeleteVPCMutation = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<{}, APIError[]>({
    mutationFn: () => deleteVPC(id),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: vpcQueries.all.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: vpcQueries.paginated._def,
      });
      queryClient.removeQueries({
        queryKey: vpcQueries.vpc(id).queryKey,
      });
    },
  });
};

// Subnet queries
export const useSubnetsQuery = (
  vpcId: number,
  params: Params,
  filter: Filter,
  enabled: boolean = true
) =>
  useQuery<ResourcePage<Subnet>, APIError[]>({
    ...vpcQueries.vpc(vpcId)._ctx.subnets._ctx.paginated(params, filter),
    enabled,
    placeholderData: keepPreviousData,
  });

export const useCreateSubnetMutation = (vpcId: number) => {
  const queryClient = useQueryClient();
  return useMutation<Subnet, APIError[], CreateSubnetPayload>({
    mutationFn: (data) => createSubnet(vpcId, data),
    onSuccess() {
      // New subnet created --> refresh the VPC queries (all, paginated, & individual), plus the /subnets VPC query
      queryClient.invalidateQueries({
        queryKey: vpcQueries.all.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: vpcQueries.paginated._def,
      });
      queryClient.invalidateQueries({
        queryKey: vpcQueries.vpc(vpcId).queryKey,
      });
    },
  });
};

export const useUpdateSubnetMutation = (vpcId: number, subnetId: number) => {
  const queryClient = useQueryClient();
  return useMutation<Subnet, APIError[], ModifySubnetPayload>({
    mutationFn: (data) => modifySubnet(vpcId, subnetId, data),
    onSuccess() {
      // New subnet created --> refresh the VPC queries (all, paginated, & individual), plus the /subnets VPC query
      queryClient.invalidateQueries({
        queryKey: vpcQueries.all.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: vpcQueries.paginated._def,
      });
      queryClient.invalidateQueries({
        queryKey: vpcQueries.vpc(vpcId).queryKey,
      });
    },
  });
};

export const useDeleteSubnetMutation = (vpcId: number, subnetId: number) => {
  const queryClient = useQueryClient();
  return useMutation<{}, APIError[]>({
    mutationFn: () => deleteSubnet(vpcId, subnetId),
    onSuccess() {
      // New subnet created --> refresh the VPC queries (all, paginated, & individual), plus the /subnets VPC query
      queryClient.invalidateQueries({
        queryKey: vpcQueries.all.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: vpcQueries.paginated._def,
      });
      queryClient.invalidateQueries({
        queryKey: vpcQueries.vpc(vpcId).queryKey,
      });
    },
  });
};

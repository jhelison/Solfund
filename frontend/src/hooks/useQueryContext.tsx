import { useRouter } from 'next/router'
import { EndpointTypes } from '../models/types'
import { useMutation } from '@tanstack/react-query'

export default function useQueryContext() {
  const router = useRouter()
  const { cluster } = router.query

  const endpoint = cluster ? (cluster as EndpointTypes) : 'mainnet'
  const hasClusterOption = endpoint !== 'mainnet'
  const fmtUrlWithCluster = (url) => {
    if (hasClusterOption) {
      const mark = url.includes('?') ? '&' : '?'
      return decodeURIComponent(`${url}${mark}cluster=${endpoint}`)
    }
    return url
  }

  return {
    fmtUrlWithCluster,
  }
}

export const useApiMutation = <
  TParams = undefined,
  TReturn = void,
  TError = Error
>(
  mutationFunction: (params: TParams) => Promise<TReturn>,
  onSuccess?: (result: TReturn) => void,
  onError?: (result: TError) => void
) => {
  return useMutation({
    mutationFn: mutationFunction,
    onSuccess,
    onError,
  });
};
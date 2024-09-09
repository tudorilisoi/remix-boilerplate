import { redirectWithToast } from 'remix-toast'
import { useStore } from './useStore'
export const useRedirectWithUniqueToast = () => {
  const { getStore, setStore } = useStore('toast')
  const seq = getStore() || 0
  setStore(seq + 1)
  return (...args) => redirectWithToast(...args)
}

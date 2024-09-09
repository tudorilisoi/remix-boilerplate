import { useState } from "react"

export const useStore = (id:string) => {
  const [store] = useState(new Map())
  const setStore = (value:string|number) => store.set(id, value)
  const getStore = () => store.get(id)
  return {
    setStore,
    getStore,
  }
}

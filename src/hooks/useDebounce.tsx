import { useEffect, useState } from "react";

export function useDebounce(callback: () => void, delay: number){
  const [debounceValue, setDebounceValue] = useState(callback)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(callback)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  })
  return debounceValue;
}
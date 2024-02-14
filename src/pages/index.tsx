import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [worker, setWorker] = useState<Worker>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setWorker(new Worker("/worker.js"))
  }, [])

  const onClick = useCallback(async () => {
    if (worker == null)
      return

    const onMessage = async (event: MessageEvent) => {
      const nonce = event.data

      const headers = new Headers()
      headers.set("x-net-nonce", nonce)

      const response = await fetch("/api", { headers })
      const text = await response.text()

      setLoading(false)

      alert(text)
    }

    worker.addEventListener("message", onMessage, { once: true })
    worker.postMessage(undefined)

    setLoading(true)
  }, [worker])

  return <button onClick={onClick}>
    {loading
      ? "Loading..."
      : "Generate"}
  </button>
}

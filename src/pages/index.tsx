import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [worker, setWorker] = useState<Worker>()
  const [loading, setLoading] = useState(false)

  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    setWorker(new Worker("/worker.js"))
  }, [])

  const onClick = useCallback(async () => {
    if (worker == null)
      return
    if (loading)
      return

    const onMessage = async (event: MessageEvent) => {
      const data = JSON.stringify(event.data)

      const headers = new Headers()
      headers.set("x-net-secrets", data)

      const response = await fetch("/api", { headers })
      const text = await response.text()

      setLoading(false)
      setMessages(x => [text, ...x])
    }

    worker.addEventListener("message", onMessage, { once: true })
    worker.postMessage(undefined)

    setLoading(true)
  }, [loading, worker])

  return <>
    <button onClick={onClick}>
      {loading
        ? "Loading..."
        : "Generate"}
    </button>
    {messages.map((message, index) =>
      <div key={index}>{message}</div>)}
  </>
}

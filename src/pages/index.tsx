import { NetworkParams } from "@/libs/network";
import { Future } from "@hazae41/future";
import { useCallback, useEffect, useState } from "react";

export async function generateOrThrow(params: NetworkParams) {
  const future = new Future<string[]>()
  const worker = new Worker("/worker.js")

  const onMessage = (e: MessageEvent<string[]>) => {
    future.resolve(e.data)
  }

  try {
    worker.addEventListener("message", onMessage, { passive: true })
    worker.postMessage(params)

    return await future.promise
  } finally {
    worker.removeEventListener("message", onMessage)
    worker.terminate()
  }
}

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
    setLoading(true)

    try {
      const response1 = await fetch("/api", { method: "OPTIONS" })

      if (!response1.ok)
        throw new Error(await response1.text())

      const chainIdString = response1.headers.get("x-net-chain")!
      const contractZeroHex = response1.headers.get("x-net-contract")!
      const receiverZeroHex = response1.headers.get("x-net-receiver")!
      const nonceZeroHex = response1.headers.get("x-net-nonce")!
      const minimumZeroHex = response1.headers.get("x-net-minimum")!

      const params = { chainIdString, contractZeroHex, receiverZeroHex, nonceZeroHex, minimumZeroHex }

      const minimumBigInt = BigInt(minimumZeroHex)

      if (minimumBigInt > (2n ** 20n))
        throw new Error("Minimum too high")

      const start = Date.now()
      const secretZeroHexArray = await generateOrThrow(params)
      const end = Date.now()

      const headers = { "x-net-secrets": JSON.stringify(secretZeroHexArray) }
      const response2 = await fetch("/api", { headers })

      if (!response2.ok)
        throw new Error(await response2.text())

      const message = `You just sent ${await response2.text()} wei in ${end - start}ms`

      setMessages(x => [message, ...x])
    } catch (e: unknown) {
      setMessages(x => ["Error", ...x])
    } finally {
      setLoading(false)
    }
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

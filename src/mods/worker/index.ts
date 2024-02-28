import "@hazae41/symbol-dispose-polyfill";

import { NetworkParams } from "@/libs/network";
import { NetworkMixin, base16_decode_mixed, base16_encode_lower, initBundledOnce } from "@hazae41/network-bundle";

async function generateOrThrow(params: NetworkParams) {
  const { chainIdString, contractZeroHex, receiverZeroHex, nonceZeroHex, minimumZeroHex } = params

  await initBundledOnce()

  const chainIdBase16 = Number(chainIdString).toString(16).padStart(64, "0")
  const chainIdMemory = base16_decode_mixed(chainIdBase16)

  const contractBase16 = contractZeroHex.slice(2).padStart(64, "0")
  const contractMemory = base16_decode_mixed(contractBase16)

  const receiverBase16 = receiverZeroHex.slice(2).padStart(64, "0")
  const receiverMemory = base16_decode_mixed(receiverBase16)

  const nonceBase16 = nonceZeroHex.slice(2).padStart(64, "0")
  const nonceMemory = base16_decode_mixed(nonceBase16)

  const mixinStruct = new NetworkMixin(chainIdMemory, contractMemory, receiverMemory, nonceMemory)

  const minimumBase16 = minimumZeroHex.slice(2).padStart(64, "0")
  const minimumMemory = base16_decode_mixed(minimumBase16)

  const generatedStruct = mixinStruct.generate(minimumMemory)

  const secretMemory = generatedStruct.to_secret()
  const secretBase16 = base16_encode_lower(secretMemory)
  const secretZeroHex = `0x${secretBase16}`

  return secretZeroHex
}

self.addEventListener("message", async (e: MessageEvent<NetworkParams>) => self.postMessage(await generateOrThrow(e.data)))
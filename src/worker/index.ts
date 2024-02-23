import "@hazae41/symbol-dispose-polyfill";

import { NetworkMixin, base16_decode_mixed, base16_encode_lower, initBundledOnce, keccak256 } from "@hazae41/network-bundle";

await initBundledOnce()

async function generateOrThrow() {
  const chainIdNumber = 100
  const chainIdBase16 = chainIdNumber.toString(16).padStart(64, "0")
  const chainIdMemory = base16_decode_mixed(chainIdBase16)

  const contractZeroHex = "0xF1eC047cbd662607BBDE9Badd572cf0A23E1130B"
  const contractBase16 = contractZeroHex.slice(2).padStart(64, "0")
  const contractMemory = base16_decode_mixed(contractBase16)

  const receiverZeroHex = "0xFF4BdfEbbf877627E02515B60B709F3Faf899884"
  const receiverBase16 = receiverZeroHex.slice(2).padStart(64, "0")
  const receiverMemory = base16_decode_mixed(receiverBase16)

  const preNonceBigInt = BigInt(Date.now()) / (1000n * 60n)
  const preNonceBase16 = preNonceBigInt.toString(16).padStart(64, "0")
  const preNonceMemory = base16_decode_mixed(preNonceBase16)

  const nonceMemory = keccak256(preNonceMemory)

  const mixinStruct = new NetworkMixin(chainIdMemory, contractMemory, receiverMemory, nonceMemory)

  const minimumBigInt = 2n ** 16n
  const minimumBase16 = minimumBigInt.toString(16).padStart(64, "0")
  const minimumMemory = base16_decode_mixed(minimumBase16)

  const generatedStruct = mixinStruct.generate(minimumMemory)

  const secretsMemory = generatedStruct.encode_secrets()
  const secretsBase16 = base16_encode_lower(secretsMemory)

  const secretZeroHexArray = new Array<string>()

  for (let i = 0; i < secretsBase16.length; i += 64)
    secretZeroHexArray.push(`0x${secretsBase16.slice(i, i + 64)}`)

  return secretZeroHexArray
}

self.addEventListener("message", async () => self.postMessage(await generateOrThrow()))
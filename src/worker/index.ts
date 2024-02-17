import "@hazae41/symbol-dispose-polyfill";

import { ZeroHexString } from "@hazae41/cubane";
import { NetworkMixin, base16_decode_mixed, base16_encode_lower, initBundledOnce } from "@hazae41/network-bundle";

async function initOrThrow(chainIdNumber: number, contractZeroHex: ZeroHexString, receiverZeroHex: ZeroHexString) {
  await initBundledOnce()

  const chainIdBase16 = chainIdNumber.toString(16).padStart(64, "0")
  const chainIdMemory = base16_decode_mixed(chainIdBase16)

  const contractBase16 = contractZeroHex.slice(2).padStart(64, "0")
  const contractMemory = base16_decode_mixed(contractBase16)

  const receiverBase16 = receiverZeroHex.slice(2).padStart(64, "0")
  const receiverMemory = base16_decode_mixed(receiverBase16)

  const mixinStruct = new NetworkMixin(chainIdMemory, contractMemory, receiverMemory)

  return { mixinStruct }
}

async function generateOrThrow() {
  const { mixinStruct } = await init

  const priceBigInt = 10n ** 5n
  const priceBase16 = priceBigInt.toString(16).padStart(64, "0")
  const priceMemory = base16_decode_mixed(priceBase16)

  const generatedStruct = mixinStruct.generate(priceMemory)

  const secretsMemory = generatedStruct.encode_secrets()
  const secretsBase16 = base16_encode_lower(secretsMemory)

  const secretBase16Array = new Array<string>()

  for (let i = 0; i < secretsBase16.length; i += 64)
    secretBase16Array.push(secretsBase16.slice(i, i + 64))

  return secretBase16Array
}

const chainIdNumber = 1
const contractZeroHex = "0xFf61BB11819455d58944A83e44b87E80CFC19eA2"
const receiverZeroHex = "0x39dfd20386F5d17eBa42763606B8c704FcDd1c1D"

const init = initOrThrow(chainIdNumber, contractZeroHex, receiverZeroHex)

init.catch(() => { })

self.addEventListener("message", async () => self.postMessage(await generateOrThrow()))
import { } from "@hazae41/symbol-dispose-polyfill";

import { Base16 } from "@hazae41/base16";
import { Writable } from "@hazae41/binary";
import { Abi, ZeroHexString } from "@hazae41/cubane";
import { Keccak256 } from "@hazae41/keccak256";

const nonces = new Set()

const address = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
const chainId = 1

const price = 10n ** 5n

function getOffsetOrThrow(address: ZeroHexString, chainId: number) {
  const struct = Abi.Tuple.create(Abi.Uint64, Abi.Address)

  const abi = struct.from([chainId, address])
  const bytes = Writable.writeToBytesOrThrow(abi)

  const memory = Keccak256.get().hashOrThrow(bytes)
  const hex = Base16.get().encodeOrThrow(memory)

  return BigInt(`0x${hex}`)
}

async function initOrThrow() {
  Keccak256.set(await Keccak256.fromMorax())

  /**
   * Compute the offset
   */
  const offset = getOffsetOrThrow(address, chainId)

  return { offset }
}

async function generateOrThrow() {
  const { offset } = await initOrThrow()

  while (true) {
    const nonceBytes = crypto.getRandomValues(new Uint8Array(32))
    const nonceZeroHex = ZeroHexString.from(Base16.get().encodeOrThrow(nonceBytes))

    if (nonces.has(nonceZeroHex))
      continue

    const memory = Keccak256.get().hashOrThrow(nonceBytes)
    const hex = Base16.get().encodeOrThrow(memory)

    const hash = BigInt(`0x${hex}`)

    const value = (((2n ** 256n) - 1n) / ((offset + hash) % (2n ** 256n)))

    if (value < price)
      continue

    nonces.add(nonceZeroHex)
    return nonceZeroHex
  }
}

self.addEventListener("message", async (event) => {
  self.postMessage(await generateOrThrow())
})

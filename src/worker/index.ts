import "@hazae41/symbol-dispose-polyfill";

import { Base16 } from "@hazae41/base16";
import { Writable } from "@hazae41/binary";
import { Abi, ZeroHexString } from "@hazae41/cubane";
import { Keccak256 } from "@hazae41/keccak256";

const maxUint256BigInt = (2n ** 256n) - 1n

export interface Secret {
  readonly secretBase16: string,
  readonly valueBigInt: bigint
}

export namespace Secret {

  export function sortLowToHigh(a: Secret, b: Secret) {
    return a.valueBigInt < b.valueBigInt ? -1 : 1
  }

}

async function initOrThrow(chainIdNumber: number, contractZeroHex: ZeroHexString, receiverZeroHex: ZeroHexString) {
  Keccak256.set(await Keccak256.fromMorax())

  const Mixin = Abi.Tuple.create(Abi.Uint64, Abi.Address, Abi.Address, Abi.Uint256)

  const chainIdBase16 = chainIdNumber.toString(16)
  const chainIdBytes = Base16.get().padStartAndDecodeOrThrow(chainIdBase16).copyAndDispose()

  const contractBase16 = contractZeroHex.slice(2)
  const contractBytes = Base16.get().padStartAndDecodeOrThrow(contractBase16).copyAndDispose()

  const receiverBase16 = receiverZeroHex.slice(2)
  const receiverBytes = Base16.get().padStartAndDecodeOrThrow(receiverBase16).copyAndDispose()

  const mixinAbi = Mixin.from([chainIdBytes, contractBytes, receiverBytes, new Uint8Array(32)])
  const mixinBytes = Writable.writeToBytesOrThrow(mixinAbi)

  return { mixinBytes }
}

function generateOrThrow({ mixinBytes }: { mixinBytes: Uint8Array }) {
  const secrets = new Array<Secret>()

  const priceBigInt = 10n ** 5n

  const maxCountNumber = 10
  const maxCountBigInt = BigInt(maxCountNumber)
  const minValueBigInt = priceBigInt / maxCountBigInt

  const mixinOffset = mixinBytes.length - 32

  const secretBytes = new Uint8Array(32)

  let totalBigInt = 0n

  while (totalBigInt < priceBigInt) {
    /**
     * Generate a secret
     */
    crypto.getRandomValues(secretBytes)

    /**
     * Generate a proof of the secret
     */
    const proofBytes = Keccak256.get().hashOrThrow(secretBytes).copyAndDispose()

    /**
     * Mix the proof with the public stuff
     */
    mixinBytes.set(proofBytes, mixinOffset)

    /**
     * Compute the divisor
     */
    const divisorBytes = Keccak256.get().hashOrThrow(mixinBytes).copyAndDispose()
    const divisorBase16 = Base16.get().encodeOrThrow(divisorBytes)
    const divisorBigInt = BigInt(`0x${divisorBase16}`)

    /**
     * Compute the value
     */
    const valueBigInt = maxUint256BigInt / divisorBigInt

    if (valueBigInt < minValueBigInt)
      continue

    if (secrets.length === maxCountNumber) {
      /**
       * Skip if the value is too small
       */
      if (valueBigInt < secrets[0].valueBigInt)
        continue

      /**
       * Replace the smallest secret
       */
      totalBigInt -= secrets[0].valueBigInt

      const secretBase16 = Base16.get().encodeOrThrow(secretBytes)
      secrets[0] = { secretBase16, valueBigInt }
    } else {
      const secretBase16 = Base16.get().encodeOrThrow(secretBytes)
      secrets.push({ secretBase16, valueBigInt })
    }

    secrets.sort(Secret.sortLowToHigh)
    totalBigInt += valueBigInt

    continue
  }

  return secrets.map(x => x.secretBase16)
}

const chainIdNumber = 1
const contractZeroHex = "0xB57ee0797C3fc0205714a577c02F7205bB89dF30"
const receiverZeroHex = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"

const init = initOrThrow(chainIdNumber, contractZeroHex, receiverZeroHex)

init.catch(() => { })

self.addEventListener("message", async () => self.postMessage(generateOrThrow(await init)))
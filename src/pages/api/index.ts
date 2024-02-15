import "@hazae41/symbol-dispose-polyfill";

import { Base16 } from "@hazae41/base16";
import { Writable } from "@hazae41/binary";
import { Abi, ZeroHexString } from "@hazae41/cubane";
import { Keccak256 } from "@hazae41/keccak256";
import { NextApiRequest, NextApiResponse } from "next";

const maxUint256BigInt = (2n ** 256n) - 1n

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

const chainIdNumber = 1
const contractZeroHex = "0xB57ee0797C3fc0205714a577c02F7205bB89dF30"
const receiverZeroHex = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"

const init = initOrThrow(chainIdNumber, contractZeroHex, receiverZeroHex)

init.catch(() => { })

const allSecretsBase16 = new Set<string>()

async function verifyOrThrow(secretsBase16: string[]) {
  const { mixinBytes } = await init

  let totalBigInt = 0n

  for (const secretBase16 of secretsBase16) {
    if (allSecretsBase16.has(secretBase16))
      continue

    /**
     * Decode the secret
     */
    const secretBytes = Base16.get().padStartAndDecodeOrThrow(secretBase16)

    /**
     * Generate a proof of the secret
     */
    const proofBytes = Keccak256.get().hashOrThrow(secretBytes).copyAndDispose()

    /**
     * Mix the proof with the public stuff
     */
    mixinBytes.set(proofBytes, mixinBytes.length - 32)

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

    allSecretsBase16.add(secretBase16)
    totalBigInt += valueBigInt
  }

  return totalBigInt
}

export default async function GET(request: NextApiRequest, response: NextApiResponse) {
  const data = request.headers["x-net-secrets"]

  if (typeof data !== "string")
    return response.status(400).send("Bad Request")

  const secrets = JSON.parse(data)

  if (!Array.isArray(secrets))
    return response.status(400).send("Bad Request")
  if (secrets.length > 10)
    return response.status(400).send("Bad Request")

  const amount = await verifyOrThrow(secrets)

  if (amount < 10n ** 5n)
    return response.status(401).send("Unauthorized")

  return response.status(200).send(`You just sent ${amount} wei to ${receiverZeroHex}`)
}
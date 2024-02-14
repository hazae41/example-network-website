import "@hazae41/symbol-dispose-polyfill";

import { Base16 } from "@hazae41/base16";
import { Writable } from "@hazae41/binary";
import { Abi, ZeroHexString } from "@hazae41/cubane";
import { Keccak256 } from "@hazae41/keccak256";
import { NextApiRequest, NextApiResponse } from "next";

const nonces = new Set<ZeroHexString>()

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

const init = initOrThrow()

async function verifyOrThrow(nonce: ZeroHexString, amount: bigint) {
  const { offset } = await init

  const bytes = Base16.get().padStartAndDecodeOrThrow(nonce.slice(2))

  const memory = Keccak256.get().hashOrThrow(bytes)
  const hex = Base16.get().encodeOrThrow(memory)

  const hash = BigInt(`0x${hex}`)

  const value = (((2n ** 256n) - 1n) / ((offset + hash) % (2n ** 256n)))

  if (value < amount)
    return undefined

  return value
}

export default async function GET(request: NextApiRequest, response: NextApiResponse) {
  const nonce = request.headers["x-net-nonce"]

  if (typeof nonce !== "string")
    return response.status(400).send("Bad Request")
  if (!ZeroHexString.is(nonce))
    return response.status(400).send("Bad Request")

  if (nonces.has(nonce))
    return response.status(401).send("Unauthorized")

  const amount = await verifyOrThrow(nonce, price)

  if (amount == null)
    return response.status(401).send("Unauthorized")

  /**
   * Save the nonce
   */
  nonces.add(nonce)
  console.log(nonce)

  return response.status(200).send(`You just sent ${amount} wei`)
}
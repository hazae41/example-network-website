import "@hazae41/symbol-dispose-polyfill";

import { ZeroHexString } from "@hazae41/cubane";
import { NetworkMixin, base16_decode_mixed, base16_encode_lower, initBundledOnce } from "@hazae41/network-bundle";
import { NextApiRequest, NextApiResponse } from "next";

const secretBase16Set = new Set<string>()

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

async function verifyOrThrow(secretBase16Array: string[]) {
  const { mixinStruct } = await init

  let secretsBase16 = ""

  for (const secretBase16 of secretBase16Array) {
    if (secretBase16Set.has(secretBase16))
      continue
    secretBase16Set.add(secretBase16)
    secretsBase16 += secretBase16
  }

  const secretsMemory = base16_decode_mixed(secretsBase16)

  const totalMemory = mixinStruct.verify_secrets(secretsMemory)
  const totalBase16 = base16_encode_lower(totalMemory)
  const totalZeroHex = `0x${totalBase16}`
  const totalBigInt = BigInt(totalZeroHex)

  return totalBigInt
}

const chainIdNumber = 1
const contractZeroHex = "0xFf61BB11819455d58944A83e44b87E80CFC19eA2"
const receiverZeroHex = "0x39dfd20386F5d17eBa42763606B8c704FcDd1c1D"

const init = initOrThrow(chainIdNumber, contractZeroHex, receiverZeroHex)

init.catch(() => { })

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

  if (amount < (10n ** 5n))
    return response.status(401).send("Unauthorized")

  return response.status(200).send(amount.toString())
}
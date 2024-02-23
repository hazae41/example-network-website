import "@hazae41/symbol-dispose-polyfill";

import { NetworkMixin, base16_decode_mixed, base16_encode_lower, initBundledOnce, keccak256 } from "@hazae41/network-bundle";
import { NextApiRequest, NextApiResponse } from "next";

await initBundledOnce()

let allSecretZeroHexSet = new Set<string>()

let preNonceBigInt = BigInt(Date.now()) / (1000n * 60n)
let preNonceBase16 = preNonceBigInt.toString(16).padStart(64, "0")
let preNonceMemory = base16_decode_mixed(preNonceBase16)

async function verifyOrThrow(secretZeroHexArray: string[]) {
  const chainIdNumber = 100
  const chainIdBase16 = chainIdNumber.toString(16).padStart(64, "0")
  const chainIdMemory = base16_decode_mixed(chainIdBase16)

  const contractZeroHex = "0xF1eC047cbd662607BBDE9Badd572cf0A23E1130B"
  const contractBase16 = contractZeroHex.slice(2).padStart(64, "0")
  const contractMemory = base16_decode_mixed(contractBase16)

  const receiverZeroHex = "0xFF4BdfEbbf877627E02515B60B709F3Faf899884"
  const receiverBase16 = receiverZeroHex.slice(2).padStart(64, "0")
  const receiverMemory = base16_decode_mixed(receiverBase16)

  const currentPreNonceBigInt = BigInt(Date.now()) / (1000n * 60n)

  if (currentPreNonceBigInt !== preNonceBigInt) {
    allSecretZeroHexSet = new Set<string>()

    preNonceBigInt = currentPreNonceBigInt
    preNonceBase16 = preNonceBigInt.toString(16).padStart(64, "0")
    preNonceMemory = base16_decode_mixed(preNonceBase16)
  }

  const nonceMemory = keccak256(preNonceMemory)

  const mixinStruct = new NetworkMixin(chainIdMemory, contractMemory, receiverMemory, nonceMemory)

  const filteredSecretZeroHexArray = secretZeroHexArray.filter(x => !allSecretZeroHexSet.has(x))
  const filteredSecretsBase16 = filteredSecretZeroHexArray.reduce((p, x) => p + x.slice(2), ``)
  const filteredSecretsMemory = base16_decode_mixed(filteredSecretsBase16)

  const valueMemory = mixinStruct.verify_secrets(filteredSecretsMemory)
  const valueBase16 = base16_encode_lower(valueMemory)
  const valueZeroHex = `0x${valueBase16}`
  const valueBigInt = BigInt(valueZeroHex)

  return valueBigInt
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

  if (amount < (2n ** 16n))
    return response.status(401).send("Unauthorized")

  return response.status(200).send(amount.toString())
}
import "@hazae41/symbol-dispose-polyfill";

import Abi from "@/mods/abi/token.abi.json";
import { Memory, NetworkMixin, base16_decode_mixed, base16_encode_lower, initBundledOnce } from "@hazae41/network-bundle";
import * as Ethers from "ethers";
import { NextApiRequest, NextApiResponse } from "next";

await initBundledOnce()

const chainIdString = "5000"
const contractZeroHex = "0x86175CB1cf1AF5320a9616B775Fc0f471378bda0"
const privateKeyZeroHex = process.env.PRIVATE_KEY_ZERO_HEX!

const provider = new Ethers.JsonRpcProvider("https://mantle-rpc.publicnode.com")
const wallet = new Ethers.Wallet(privateKeyZeroHex).connect(provider)
const contract = new Ethers.Contract(contractZeroHex, Abi, wallet)

const minimumBigInt = 2n ** 10n
const minimumBase16 = minimumBigInt.toString(16).padStart(64, "0")
const minimumZeroHex = `0x${minimumBase16}`

const chainIdNumber = Number(chainIdString)
const chainIdBase16 = chainIdNumber.toString(16).padStart(64, "0")
const chainIdMemory = base16_decode_mixed(chainIdBase16)

const contractBase16 = contractZeroHex.slice(2).padStart(64, "0")
const contractMemory = base16_decode_mixed(contractBase16)

const receiverZeroHex = wallet.address
const receiverBase16 = receiverZeroHex.slice(2).padStart(64, "0")
const receiverMemory = base16_decode_mixed(receiverBase16)

let nonceBytes = crypto.getRandomValues(new Uint8Array(32))
let nonceMemory = new Memory(nonceBytes)
let nonceBase16 = base16_encode_lower(nonceMemory)
let nonceZeroHex = `0x${nonceBase16}`

let allSecretZeroHexSet = new Set<string>()
let allSecretBalanceBigInt = 0n

let mixinStruct = new NetworkMixin(chainIdMemory, contractMemory, receiverMemory, nonceMemory)

export default async function handle(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === "OPTIONS") {
    response.status(200)
      .setHeader("x-net-chain", chainIdString)
      .setHeader("x-net-contract", contractZeroHex)
      .setHeader("x-net-receiver", receiverZeroHex)
      .setHeader("x-net-nonce", nonceZeroHex)
      .setHeader("x-net-minimum", minimumZeroHex)
      .end()
    return
  }

  if (request.method === "GET") {
    const data = request.headers["x-net-secrets"]

    if (typeof data !== "string") {
      response.status(400).send("Bad Request")
      return
    }

    const secretZeroHexArray = JSON.parse(data)

    if (!Array.isArray(secretZeroHexArray)) {
      response.status(400).send("Bad Request")
      return
    }

    if (secretZeroHexArray.length > 10) {
      response.status(400).send("Bad Request")
      return
    }

    const filteredSecretZeroHexArray = secretZeroHexArray.filter(x => !allSecretZeroHexSet.has(x))
    const filteredSecretsBase16 = filteredSecretZeroHexArray.reduce((p, x) => p + x.slice(2), ``)
    const filteredSecretsMemory = base16_decode_mixed(filteredSecretsBase16)

    const valueMemory = mixinStruct.verify_secrets(filteredSecretsMemory)
    const valueBase16 = base16_encode_lower(valueMemory)
    const valueZeroHex = `0x${valueBase16}`
    const valueBigInt = BigInt(valueZeroHex)

    if (valueBigInt < minimumBigInt) {
      response.status(401).send("Unauthorized")
      return
    }

    for (const secretZeroHex of filteredSecretZeroHexArray)
      allSecretZeroHexSet.add(secretZeroHex)

    console.log(`Received ${valueBigInt.toString()} wei`)

    allSecretBalanceBigInt += valueBigInt

    if (allSecretZeroHexSet.size > 640) {
      console.log(`Claiming ${allSecretBalanceBigInt.toString()} wei`)

      contract.claim(nonceZeroHex, [...allSecretZeroHexSet]).catch(console.error)

      allSecretZeroHexSet = new Set<string>()
      allSecretBalanceBigInt = 0n

      nonceBytes = crypto.getRandomValues(new Uint8Array(32))
      nonceMemory = new Memory(nonceBytes)
      nonceBase16 = base16_encode_lower(nonceMemory)
      nonceZeroHex = `0x${nonceBase16}`

      mixinStruct = new NetworkMixin(chainIdMemory, contractMemory, receiverMemory, nonceMemory)
    }

    response.status(200).send(valueBigInt.toString())
    return
  }

  response.status(404).send("Not Found")
  return
}
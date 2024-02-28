import "@hazae41/symbol-dispose-polyfill";

import Abi from "@/mods/abi/token.abi.json";
import { Memory, NetworkMixin, base16_decode_mixed, base16_encode_lower, initBundledOnce } from "@hazae41/network-bundle";
import * as Ethers from "ethers";
import { NextApiRequest, NextApiResponse } from "next";

await initBundledOnce()

const chainIdString = "100"
const contractZeroHex = "0xF1eC047cbd662607BBDE9Badd572cf0A23E1130B"
const privateKeyZeroHex = process.env.PRIVATE_KEY_ZERO_HEX!

const provider = new Ethers.JsonRpcProvider("https://gnosis-rpc.publicnode.com")
const wallet = new Ethers.Wallet(privateKeyZeroHex).connect(provider)
const contract = new Ethers.Contract(contractZeroHex, Abi, wallet)

const minimumBigInt = 2n ** 16n
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

const nonceBytes = crypto.getRandomValues(new Uint8Array(32))
const nonceMemory = new Memory(nonceBytes)
const nonceBase16 = base16_encode_lower(nonceMemory)
const nonceZeroHex = `0x${nonceBase16}`

const mixinStruct = new NetworkMixin(chainIdMemory, contractMemory, receiverMemory, nonceMemory)

const allSecretZeroHexSet = new Set<string>()

let pendingSecretZeroHexArray = new Array<string>()
let pendingTotalValueBigInt = 0n

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
    const secretZeroHex = request.headers["x-net-secret"]

    if (typeof secretZeroHex !== "string") {
      response.status(400).send("Bad Request")
      return
    }

    if (secretZeroHex.length !== 66) {
      response.status(400).send("Bad Request")
      return
    }

    if (allSecretZeroHexSet.has(secretZeroHex)) {
      response.status(400).send("Bad Request")
      return
    }

    allSecretZeroHexSet.add(secretZeroHex)

    const secretBase16 = secretZeroHex.slice(2).padStart(64, "0")
    const secretMemory = base16_decode_mixed(secretBase16)

    const valueMemory = mixinStruct.verify_secret(secretMemory)
    const valueBase16 = base16_encode_lower(valueMemory)
    const valueZeroHex = `0x${valueBase16}`
    const valueBigInt = BigInt(valueZeroHex)

    if (valueBigInt < minimumBigInt) {
      response.status(400).send("Bad Request")
      return
    }

    console.log(`Received ${valueBigInt.toString()} wei`)

    pendingSecretZeroHexArray.push(secretZeroHex)
    pendingTotalValueBigInt += valueBigInt

    if (allSecretZeroHexSet.size > 640) {
      console.log(`Claiming ${pendingTotalValueBigInt.toString()} wei`)
      contract.claim(nonceZeroHex, pendingSecretZeroHexArray).catch(console.error)

      pendingSecretZeroHexArray = new Array<string>()
      pendingTotalValueBigInt = 0n
    }

    response.status(200).send(valueBigInt.toString())
    return
  }

  response.status(404).send("Not Found")
  return
}
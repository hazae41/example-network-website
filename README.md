# Example Website with Network API

This is an example Next.js website using Network to monetize its API

### Constraints
- Only short-term in-memory state
- Compatible with serverless functions
- Non-interactive and only uses a middleware

### Protocol

The client sends a regular REST request to the server, but with an extra `x-net-secrets` header containing Network secrets.

Of course, the connection needs to be secure (local or using HTTPS) to prevent an attacker from stealing the secrets.

Since the API and the website are tied, then chainID, contract address, and receiver address are statically known on both sides.

The whole process only requires short-lived state to prevent replay attack on a nonce.

```tsx
const allSecrets = new Set<string>()

function handle(request: Request, secrets: string[]) {
  const filteredSecrets = secrets.filter(x => !allSecrets.has(x))

  // ...

  for (const secret of filteredSecrets)
    allSecrets.add(secret)

  // ...

  return new Response(...)
}
```

The nonce is also known on both sides and is automatically rotated based on the current timestamp (milliseconds-since-epoch).

```tsx
const nonce = keccak256(Date.now())
```

We want a nonce changing for every new block on Gnosis chain, the current block-time is ~5-seconds.

```tsx
const nonce = keccak256(BigInt(Date.now()) / (1000n * 5n))
```

We know the timestamp of some block (`1708787955000`) and substract it from the current timestamp.

```tsx
const nonce = keccak256((BigInt(Date.now()) - 1708787955000n) / (1000n * 5n))
```

With this formula, the nonce is automatically rotated on every new block, and so can the memory.

```tsx
let allSecrets = new Set<string>()

let previousNonce = keccak256((BigInt(Date.now()) - 1708787955000n) / (1000n * 5n))

function handle(request: Request, secrets: string[]) {
  const currentNonce = keccak256((BigInt(Date.now()) - 1708787955000n) / (1000n * 5n))

  // If nonce rotated (new block)
  if (currentNonce !== previousNonce) {
    // Then clear memory
    allSecrets = new Set<string>()
  }  

  const filteredSecrets = secrets.filter(x => !allSecrets.has(x))

  // ...

  for (const secret of filteredSecrets)
    allSecrets.add(secret)

  // ...

  return new Response(...)
}
```

That means if your server had enough secrets during a block-time (nonce-time) to have an higher profit than gas fees, then they can be claimed.

```tsx
if (allSecrets.size > minSecretsPerTx) {
  claim(currentNonce, [...allSecrets])
}
```

You have to make sure that you pay enough gas to include your transaction in the next block to avoid backpressure, you also have to check every time if it's worth it depending on gas price.

```tsx
if ((value * tokenPrice) < (gasLimit * gasPrice))
  return
```

If you use serverless functions, you also have to make sure they live long enough to claim at least one block (the lifespan is ~15 seconds on Vercel so it should work fine there).

A malicious client could theorically try to replay secrets if they are sent between two lifes of a serverless function within the same block-time

1) A serverless function lifespan cannot be precisely predicted by a client
2) A serverless function birth date cannot be precisely predicted by a client
3) Attempts of replay attack can be severely slashed by the server (e.g. IP ban) 

Similarly, a malicious client could also try to replay secrets between serverless functions in different regions

1) Load balancing cannot be precisely predicted by a client
2) Attempts of replay attack can be severely slashed by the server (e.g. IP ban)

A real solution is to use a meta-memory such as Redis or CloudFlare Durable Object to keep track of secrets, but this is out of scope of this example.

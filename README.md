# Example website with Network API

This is an example Next.js website using [Network](https://github.com/stars/hazae41/lists/network) to monetize its API

## Constraints

- Only short-term in-memory state
- Compatible with serverless functions

## Getting started

### Environment variables

#### `PRIVATE_KEY_ZERO_HEX` (required)

Your Ethereum private key as a 0x-prefixed base16 string

e.g. `0x35609a4c7e0334d76e15d107c52ee4e9beab1199556cef78fd8624351c0e2c8c`

## Protocol

The client sends a regular REST request to the server, but with an extra `x-net-secret` header containing a Network secret.

Of course, the connection needs to be secure (local or using HTTPS) to prevent an attacker from stealing the secret.

The client retrieves the Network parameters using an `OPTIONS` request at the same endpoint it wants to deal with.

The whole process only requires short-lived state to prevent replay attack.

```tsx
const allSecrets = new Set<string>()

function handle(request: Request, secret: string) {
  if (allSecrets.has(secret))
    throw new Error()
  
  allSecrets.add(secret)

  // ...

  return new Response(...)
}
```

If you use serverless functions, you have to make sure they live long enough to claim at least one transaction (the lifespan is ~15 seconds on Vercel so it should work fine there).

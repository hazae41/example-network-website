# Example Website with Network API

This is an example Next.js website using Network to monetize its API

### Constraints
- Only short-term in-memory state
- Compatible with serverless functions

### Protocol

The client sends a regular REST request to the server, but with an extra `x-net-secrets` header containing Network secrets.

Of course, the connection needs to be secure (local or using HTTPS) to prevent an attacker from stealing the secrets.

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

If you use serverless functions, you have to make sure they live long enough to claim at least one transaction (the lifespan is ~15 seconds on Vercel so it should work fine there).

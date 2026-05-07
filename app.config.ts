/**
 * App-level config. Bundled into the build — anything here ships to the client.
 * Don't put real secrets in here.
 */
export default defineAppConfig({
  gate: {
    /**
     * When true, the site is gated by a client-side password prompt.
     * Set to false to disable the gate (e.g. once the site is publicly launched).
     */
    enabled: true,

    /**
     * SHA-256 hash of the gate password.
     *
     * Default password is "slashuntitled" — CHANGE THIS BEFORE SHARING THE LINK.
     *
     * To generate a new hash:
     *   bash:    echo -n "your-password" | shasum -a 256
     *   browser: crypto.subtle.digest('SHA-256', new TextEncoder().encode('your-password'))
     *              .then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2,'0')).join('')))
     *
     * Caveat: this is a *soft* gate. The password hash and underlying HTML are
     * downloadable. It blocks casual visitors and search crawlers, not a
     * determined attacker. For real protection use a Cloudflare Worker or a
     * host that supports server-side auth.
     */
    passwordHash: '442d61bfd0a502e5f3652b10d7af0ffebd9b36b2f32a96780ae8d57fcce6392f'
  }
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    gate?: {
      enabled?: boolean
      passwordHash?: string
    }
  }
}

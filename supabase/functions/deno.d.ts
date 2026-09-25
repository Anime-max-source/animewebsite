// Ambient type declarations for Deno in Supabase Edge Functions
// This resolves "Cannot find name 'Deno'" in IDEs without requiring external tools.

declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined
    set(key: string, value: string): void
    delete(key: string): void
    toObject(): Record<string, string>
  }
  export const env: Env

  export function serve(
    handler: (request: Request) => Response | Promise<Response>,
    options?: {
      port?: number
      hostname?: string
      onListen?: (params: { port: number; hostname: string }) => void
    }
  ): void
}

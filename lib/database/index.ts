import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_URI_FALLBACK = process.env.MONGODB_URI_FALLBACK; // optional standard (non-SRV) URI
const DB_NAME = process.env.MONGODB_DB_NAME || "evently";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

const globalWithMongoose = global as typeof globalThis & {
  mongoose: MongooseCache;
};

// Ensure a single shared cache across hot reloads and module reloads
const cached: MongooseCache =
  (globalWithMongoose.mongoose as MongooseCache) ||
  ((globalWithMongoose.mongoose = { conn: null, promise: null }),
  globalWithMongoose.mongoose);

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");

  // Try primary URI first, then optional fallback
  const uris = [MONGODB_URI, MONGODB_URI_FALLBACK].filter(Boolean) as string[];

  let lastError: unknown;

  for (const uri of uris) {
    try {
      cached.promise =
        cached.promise ||
        mongoose.connect(uri, {
          dbName: DB_NAME,
          // Faster fail on unreachable/blocked networks
          serverSelectionTimeoutMS: 10_000,
          connectTimeoutMS: 10_000,
        });

      cached.conn = await cached.promise;
      globalWithMongoose.mongoose = cached;
      return cached.conn;
    } catch (err: unknown) {
      lastError = err;
      // reset promise so next iteration can attempt a new connection
      cached.promise = null;
      // If SRV lookup timed out, try the next URI (if any)
      type MaybeErr = {
        code?: string;
        syscall?: string;
        hostname?: string;
        cause?: { code?: string; syscall?: string; hostname?: string };
      };
      const e = err as MaybeErr;
      const code = e?.code || e?.cause?.code;
      const syscall = e?.syscall || e?.cause?.syscall;
      const isSrvTimeout = code === "ETIMEOUT" && syscall === "querySrv";

      // Only continue loop if we have another URI to try; otherwise, break to throw an informative error
      if (!isSrvTimeout) break;
      // else continue to next uri (fallback)
    }
  }

  // If we reach here, connection failed for all URIs. Provide a clearer error message when it's SRV-related.
  type MaybeErr = {
    code?: string;
    syscall?: string;
    hostname?: string;
    cause?: { code?: string; syscall?: string; hostname?: string };
  };
  const err = lastError as MaybeErr;
  const code = err?.code || err?.cause?.code;
  const syscall = err?.syscall || err?.cause?.syscall;
  const hostname = err?.hostname || err?.cause?.hostname;

  if (code === "ETIMEOUT" && syscall === "querySrv") {
    throw new Error(
      `MongoDB SRV lookup timed out for ${
        hostname || "your cluster host"
      }. This is usually a DNS or network issue. ` +
        `Options: (1) Ensure internet/DNS works and UDP/53 is allowed (try Resolve-DnsName _mongodb._tcp.<cluster-host>), ` +
        `(2) Prefer IPv4 networking, (3) Use a standard (non-SRV) connection string via MONGODB_URI_FALLBACK.`
    );
  }

  // Unknown/other error
  throw err;
};

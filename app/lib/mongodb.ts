import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

function formatMongoConnectionError(err: unknown) {
  const message = err instanceof Error ? err.message : String(err);

  if (message.includes("querySrv") && message.includes("_mongodb._tcp")) {
    return [
      "MongoDB DNS SRV lookup failed (querySrv).",
      "This is usually caused by a network/DNS restriction (VPN, corporate DNS, firewall).",
      "Fix: try switching your DNS to 8.8.8.8 or 1.1.1.1, disable VPN/proxy, or use a non-SRV connection string (mongodb://...) from MongoDB Atlas.",
      `Original: ${message}`,
    ].join(" ");
  }

  return message;
}

function getMongoClientPromise() {
  if (global.__mongoClientPromise) return global.__mongoClientPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI env var.");
  }

  console.log("[MongoDB] Connecting to MongoDB...");
  const client = new MongoClient(uri);
  const promise = client.connect().catch((err: unknown) => {
    if (global.__mongoClientPromise === promise) {
      global.__mongoClientPromise = undefined;
    }
    const formattedError = formatMongoConnectionError(err);
    console.error("[MongoDB] Connection failed:", formattedError);
    throw new Error(formattedError);
  });

  global.__mongoClientPromise = promise;
  return promise;
}

export async function getDb() {
  const connectedClient = await getMongoClientPromise();
  const dbName = process.env.MONGODB_DB?.trim() || "ticket-r";
  const db = connectedClient.db(dbName);
  console.log("[MongoDB] Connected to database:", dbName);
  return db;
}

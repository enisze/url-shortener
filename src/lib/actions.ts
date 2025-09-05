"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateHash(): string {
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export async function shortenUrl(
  url: string,
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    new URL(url);

    const existing = await prisma.shortenedUrl.findFirst({
      where: { originalUrl: url },
    });

    if (existing) {
      return { success: true, hash: existing.hash };
    }

    let hash = generateHash();
    let attempts = 0;

    while (attempts < 5) {
      const exists = await prisma.shortenedUrl.findUnique({
        where: { hash },
      });

      if (!exists) break;

      hash = generateHash();
      attempts++;
    }

    if (attempts >= 5) {
      return { success: false, error: "Unable to generate unique hash" };
    }

    const shortened = await prisma.shortenedUrl.create({
      data: {
        hash,
        originalUrl: url,
      },
    });

    return { success: true, hash: shortened.hash };
  } catch {
    return { success: false, error: "Invalid URL" };
  }
}

export async function getOriginalUrl(hash: string): Promise<string | null> {
  try {
    const result = await prisma.shortenedUrl.findUnique({
      where: { hash },
    });

    return result?.originalUrl || null;
  } catch {
    return null;
  }
}

"use client";

import { getOpsSnapshot, ingestOps } from "./store";
import type { OpsPayload } from "./ops-shared";

let timer: number | undefined;
let pushing = false;
let pending = false;
let watching = false;

async function postOps() {
  if (typeof window === "undefined") return false;
  if (pushing) {
    pending = true;
    return false;
  }
  pushing = true;
  try {
    const res = await fetch("/api/ops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getOpsSnapshot()),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("ops_push_failed", await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("ops_push_failed", error);
    return false;
  } finally {
    pushing = false;
    if (pending) {
      pending = false;
      void postOps();
    }
  }
}

export function scheduleOpsPush(immediate = false) {
  if (typeof window === "undefined") return;
  ensureWatch();
  window.clearTimeout(timer);
  if (immediate) {
    void postOps();
    return;
  }
  timer = window.setTimeout(() => {
    void postOps();
  }, 250);
}

export async function pushOpsNow() {
  ensureWatch();
  return postOps();
}

export async function pullOps() {
  if (typeof window === "undefined") return;
  ensureWatch();
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`/api/ops?t=${Date.now()}`, { cache: "no-store", signal: controller.signal });
    window.clearTimeout(timeout);
    if (!res.ok) return;
    const json = (await res.json()) as OpsPayload;
    ingestOps(json);
  } catch {
    /* hub is best-effort */
  }
}

function ensureWatch() {
  if (watching || typeof window === "undefined") return;
  watching = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void postOps();
  });
}

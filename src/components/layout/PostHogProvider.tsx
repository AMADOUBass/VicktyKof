"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

if (typeof window !== "undefined") {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (key && host) {
    posthog.init(key, {
      api_host: host,
      person_profiles: "always", // or 'identified_only' to only create profiles for identified users
      capture_pageview: false, // Disable automatic pageview capture, as we use manual track for Next.js
      capture_pageleave: true,
    });
  }
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

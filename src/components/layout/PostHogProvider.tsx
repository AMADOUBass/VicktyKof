"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (key && host) {
      // Delay initialization to reduce TBT (Total Blocking Time)
      const timeout = setTimeout(() => {
        posthog.init(key, {
          api_host: host,
          person_profiles: "always",
          capture_pageview: false,
          capture_pageleave: true,
          // Respect privacy by default if no choice is made yet
          persistence: "localStorage+cookie",
        });
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

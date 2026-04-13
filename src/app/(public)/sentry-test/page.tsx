"use client";

import { useEffect } from "react";

export default function SentryTestPage() {
  useEffect(() => {
    // This will trigger an error on the client side
    // @ts-ignore
    // myUndefinedFunction();
  }, []);

  const triggerError = () => {
    throw new Error("Sentry Test Error from VicktyKof!");
  };

  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center p-4">
      <div className="card max-w-md w-full text-center space-y-6">
        <h1 className="font-display text-3xl font-bold text-brand-beige">Sentry Test</h1>
        <p className="text-brand-muted">
          Cliquez sur le bouton ci-dessous pour déclencher une erreur et vérifier que Sentry la capture.
        </p>
        <button
          onClick={triggerError}
          className="btn-primary w-full"
        >
          Déclencher l'erreur
        </button>
      </div>
    </div>
  );
}

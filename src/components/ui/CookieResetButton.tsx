'use client';

export function CookieResetButton() {
  const handleReset = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("vicktykof_cookie_consent");
      window.location.reload();
    }
  };

  return (
    <button
      className="text-brand-gold hover:underline cursor-pointer bg-transparent border-none p-0"
      onClick={handleReset}
    >
      Gérer mes cookies
    </button>
  );
}

import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VicktyKof Salon",
    short_name: "VicktyKof",
    description: "Salon premium spécialisé en locs, interlocks et coiffures afro à Québec.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    icons: [
      {
        src: "/favicon.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

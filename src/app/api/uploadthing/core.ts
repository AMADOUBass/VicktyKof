import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";

const f = createUploadthing({
  errorFormatter: (err) => {
    console.error("UploadThing Error:", err);
    return { message: err.message };
  },
});

export const ourFileRouter = {
  portfolioUploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      // Temporairement désactivé pour débogage production
      // const session = await auth();
      // if (!session || (session.user.role !== "STYLIST" && session.user.role !== "ADMIN")) {
      //   throw new Error("Non autorisé");
      // }
      return { userId: "VICKY_ADMIN" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { url: file.ufsUrl };
    }),

  avatarUploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      // const session = await auth();
      // if (!session) throw new Error("Non autorisé");
      return { userId: "VICKY_ADMIN" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar upload for userId:", metadata.userId);
      return { url: file.ufsUrl };
    }),

  galleryUploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      // const session = await auth();
      // if (!session || session.user.role !== "ADMIN") {
      //   throw new Error("Non autorisé");
      // }
      return { userId: "VICKY_ADMIN" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Gallery upload for userId:", metadata.userId);
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

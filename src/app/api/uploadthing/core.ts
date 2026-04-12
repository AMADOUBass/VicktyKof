import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  portfolioUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session || (session.user.role !== "STYLIST" && session.user.role !== "ADMIN")) {
        throw new Error("Non autorisé");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { url: file.ufsUrl };
    }),

  avatarUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session) throw new Error("Non autorisé");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar upload for userId:", metadata.userId);
      return { url: file.ufsUrl };
    }),

  galleryUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session || session.user.role !== "ADMIN") {
        throw new Error("Non autorisé");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Gallery upload for userId:", metadata.userId);
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

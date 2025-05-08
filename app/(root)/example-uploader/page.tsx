"use client";

import { UploadButton } from "@/lib/uploadthing";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          console.log("✅ Upload complete callback fired");
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          alert(`❌ ERROR! ${error.message}`);
        }}
      />
    </main>
  );
}

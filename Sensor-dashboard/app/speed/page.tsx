export const dynamic = "force-dynamic"; // Evita error en Vercel por prerender

import { Suspense } from "react";
import SpeedPageContent from "@/components/speed-page-content";

export default function SpeedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SpeedPageContent />
    </Suspense>
  );
}

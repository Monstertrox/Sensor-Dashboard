export const dynamic = "force-dynamic"; // evita prerendering estático

import { Suspense } from "react";
import SpeedPageContent from "@/components/speed-page-content";

export default function SpeedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SpeedPageContent />
    </Suspense>
  );
}

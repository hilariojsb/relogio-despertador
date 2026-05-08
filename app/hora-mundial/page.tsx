import type { Metadata } from "next";
import AdBanner from "@/components/ads/AdBanner";
import { AppShell } from "@/components/layout";
import { HoraMundialPageClient } from "./HoraMundialPageClient";
import "./world-clock-page.css";

export const metadata: Metadata = {
  title: "Hora Mundial Online (Relógio de Todos os Países em Tempo Real)",
  description:
    "Veja a hora mundial online em tempo real. Compare horários de diferentes países e cidades de forma rápida e precisa.",
};

export default function HoraMundialPage() {
  return (
    <div className="world-clock-page min-h-[calc(100vh-3.5rem)] bg-[#F8FAFC]">
      <AppShell maxWidth="6xl" className="max-w-7xl bg-transparent">
        <AdBanner slot="top" />
        <HoraMundialPageClient />
        <AdBanner slot="middle" />
        <AdBanner slot="bottom" />
      </AppShell>
    </div>
  );
}

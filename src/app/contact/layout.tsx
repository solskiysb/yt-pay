import { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `Contact — ${siteConfig.name}`,
  description: `Get in touch with the ${siteConfig.name} team. We respond within 24 hours.`,
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

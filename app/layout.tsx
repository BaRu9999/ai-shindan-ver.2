import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "今日の和茶タイプ診断｜祇園茶寮×タニタカフェ",
  description:
    "7つの質問から、今日のあなたに合う和茶タイプとおすすめメニューが分かります。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

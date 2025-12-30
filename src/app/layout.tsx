// src/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Prompt Ops Mini Dashboard",
  description: "Prompt migration and evaluation dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}

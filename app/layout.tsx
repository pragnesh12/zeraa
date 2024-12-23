import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import { Header } from "@/components/Header";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zeraa",
  description: "An Advanced Project Managment App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <ClerkProvider
        appearance={{
          baseTheme: [shadesOfPurple],
          variables: {
            colorPrimary: "#3b82f6",
            colorBackground: "#1a202c",
            colorInputBackground: "#2D3748",
            colorInputText: "#F3F4F6",
            fontSize: "15px ",
          },
          elements: {
            formButtonPrimary: "bg-purple-600 hover:bg-purple-700 text-white",
            card: "bg-gray-800",
            headerTitle: "text-blue-400",
            headerSubtitle: "text-gray-400",
          },
        }}
      >
        <body
          className={`${inter.className} dotted-background`}
          suppressHydrationWarning={true}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Header */}
            <Header />
            <Toaster richColors />
            <main className="min-h-screen"> {children}</main>
            <footer className="bg-gray-900/70 py-12 text-white font-semibold text-center text-sm">
              Made with by 🙂{" "}
              <span className="bg-gray-400/55 p-1 text-black">
                my commitment.
              </span>
            </footer>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}

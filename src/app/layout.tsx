import AuthProvider from "@/components/AuthProvider";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";

// do not cache this layout
export const revalidate = 0;

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
          <main className="flex w-full flex-1 shrink-0 flex-col items-center justify-center px-8 text-center sm:px-20">
            <h1 className="mb-12 text-5xl font-bold sm:text-6xl">
              Learning Tracking
            </h1>
            <AuthProvider accessToken={session?.access_token || ""}>
              {children}
            </AuthProvider>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}

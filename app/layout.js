// app/layout.js
import "./globals.css";
import { UserProvider } from "./_components/userContext";
import { LikeProvider } from "./_components/LikeContext";
import AuthWrapper from "./_components/AuthWrapper";

export const metadata = {
  title: {
    template: "%s Kachinpedia",
    default: "Welcome / Kachinpedia",
  },
  description: "Learning with Kachinpedia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Yusei+Magic&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex-grow font-zen-maru-gothic bg-gradient-to-br from-amber-50 to-orange-100">
        <UserProvider>
          <LikeProvider>
            <AuthWrapper>{children}</AuthWrapper>
          </LikeProvider>
        </UserProvider>
      </body>
    </html>
  );
}

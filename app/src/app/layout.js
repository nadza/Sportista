import { Inter } from "next/font/google";
import { LanguageProvider } from './context/LanguageContext';
import LayoutWithNavFooter from './layoutNF'; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sportista",
  description: "Sportista - DWS projekat 2024; Tim 2",
};

export default function RootLayout({ children }) {
  return (
    <LanguageProvider>
      <html lang="en">
        <body className={inter.className} style={{ margin: 0 }}>
          <LayoutWithNavFooter>
            {children}
          </LayoutWithNavFooter>
        </body>
      </html>
    </LanguageProvider>
  );
}

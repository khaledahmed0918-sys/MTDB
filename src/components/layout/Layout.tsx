import { ReactNode, useState } from "react";
import { Topbar } from "./Topbar";
import { MobileMenu } from "./MobileMenu";
import { SearchSection } from "./SearchSection";
import { ErrorBoundary } from "../ErrorBoundary";
import { useI18n } from "@/contexts/I18nContext";
import { Globe, Facebook, Instagram, Twitter, Youtube, Github } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useI18n();

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-white font-sans selection:bg-mt-primary selection:text-black">
      <Topbar onOpenMenu={() => setIsMenuOpen(true)} />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <main className="flex-1 w-full pb-12 relative bg-[#0c0b00]">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 pt-4 md:pt-6">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </main>

      {/* Basic Footer like IMDb */}
      <footer className="py-12 border-t border-white/10 bg-[#0c0b00] text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-6 text-[#fff]">
             <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors text-[#ccc] hover:text-white">
                <Github className="w-5 h-5" />
             </div>
             <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors text-[#ccc] hover:text-white">
                <Instagram className="w-5 h-5" />
             </div>
             <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors text-[#ccc] hover:text-white">
                <Twitter className="w-5 h-5" />
             </div>
             <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors text-[#ccc] hover:text-white">
                <Youtube className="w-5 h-5" />
             </div>
             <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors text-[#ccc] hover:text-white">
                <Facebook className="w-5 h-5" />
             </div>
          </div>

          <div className="mt-4">
            <div className="bg-mt-primary px-3 py-1 rounded-sm font-black text-black text-xl mb-4 inline-block shadow-sm">
                MTDb
            </div>
          </div>

          <div className="max-w-2xl px-4 mt-2">
             <p className="text-[#888] text-xs font-medium" dir="ltr">
               {t('copyright').replace('{year}', new Date().getFullYear().toString())}
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

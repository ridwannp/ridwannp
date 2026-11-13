import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, ExternalLink, Sparkles } from 'lucide-react';

interface PageLayoutProps {
  doorTitle: string;
  doorBadge?: string;
  doorColor: string;
  doorTextColor: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  doorTitle,
  doorBadge,
  doorColor,
  doorTextColor,
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="min-h-screen bg-[#FBFAF7] text-[#141218] flex flex-col font-sans selection:bg-[#FFE7B0] selection:text-[#1A1720]">
      {/* Top Bar with 'Kembali ke teras' */}
      <header className="sticky top-0 z-40 bg-[#FBFAF7]/85 backdrop-blur-md border-b border-[#141218]/10 safe-top safe-left safe-right px-6 md:px-12 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-2.5 text-xs md:text-sm font-sans font-medium text-[#141218] hover:opacity-80 transition-all"
            aria-label="Kembali ke halaman utama teras"
          >
            <span className="p-1.5 rounded-full bg-white border border-[#141218]/10 group-hover:-translate-x-1 transition-transform">
              <ArrowLeft className="w-4 h-4 text-[#141218]" />
            </span>
            <span className="font-semibold">Kembali ke teras</span>
          </Link>

          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${doorColor}20`,
                color: doorTextColor,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: doorColor }}
              />
              <span>{doorTitle}</span>
              {doorBadge && <span className="opacity-70">· {doorBadge}</span>}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Page Header */}
        <div className="mb-12 border-b border-[#141218]/10 pb-8">
          <h1 className="font-serif italic text-4xl sm:text-5xl md:text-6xl text-[#141218] tracking-tight leading-[1.1]">
            {title}
          </h1>
          <p className="mt-4 font-sans text-base sm:text-lg text-[#5E5669] max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Page Body Content */}
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#141218]/10 safe-bottom px-6 md:px-12 py-8 bg-[#F4F2EC]/60 text-xs font-sans text-[#5E5669]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8F879A]" />
            <span>Ridwan Nurdiyanto Putra · Technical Lead · Product Owner · AI / Automation</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="mailto:ridwannurdiyanto93@gmail.com"
              className="inline-flex items-center gap-1.5 text-[#141218] hover:underline font-medium"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>ridwannurdiyanto93@gmail.com</span>
            </a>
            <Link to="/" className="text-[#141218] hover:underline font-medium inline-flex items-center gap-1">
              <span>Teras</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};


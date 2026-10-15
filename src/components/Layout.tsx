import { type ReactNode } from 'react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  fullHeight?: boolean;
}

export default function Layout({ children, showFooter = true, fullHeight = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-ink-50">
      <Navbar />
      <main className={`flex-1 ${fullHeight ? '' : 'pb-20 lg:pb-0'}`}>{children}</main>
      {showFooter && <Footer />}
      <BottomNav />
    </div>
  );
}

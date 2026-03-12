import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals-user.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ weight: ['400', '600', '700'], subsets: ['latin'], variable: '--font-poppins' });

export const metadata: Metadata = {
  title: 'Enemme Studios | Cinematic Visual Storytelling',
  description: 'Crafting timeless cinematic experiences through the art of visual storytelling',
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} ${poppins.variable} bg-cinema-black text-cinema-white min-h-screen font-sans`}>
      {children}
    </div>
  );
}

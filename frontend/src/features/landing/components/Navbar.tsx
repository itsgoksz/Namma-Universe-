import { Link } from 'react-router-dom';

interface NavbarProps {
  onOpenDemo: () => void;
}

export default function Navbar({ onOpenDemo }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass border-b border-[var(--color-border)]" style={{ background: 'rgba(18, 11, 15, 0.8)' }}>
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg" style={{ background: 'var(--color-accent)', color: 'white' }}>
            A
          </div>
          <span className="text-xl font-bold tracking-tight">Aiva</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#industries" className="hover:text-white transition-colors">Industries</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-white transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
            Sign in
          </Link>
          <button
            onClick={onOpenDemo}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95 text-white"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            Book a Demo
          </button>
        </div>
      </div>
    </nav>
  );
}

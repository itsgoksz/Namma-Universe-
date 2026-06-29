export default function WelloraFooter() {
  return (
    <footer className="py-12 border-t border-[var(--color-border)]" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center font-bold text-xs" style={{ background: 'var(--color-text-secondary)', color: 'var(--color-bg-primary)' }}>
              W
            </div>
            <span className="font-bold tracking-tight text-lg" style={{ color: 'var(--color-text-secondary)' }}>Wellora</span>
          </div>
          
          <div className="flex gap-8 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          
          <div className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            &copy; {new Date().getFullYear()} Wellora Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

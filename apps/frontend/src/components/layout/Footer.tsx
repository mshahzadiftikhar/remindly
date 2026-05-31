import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#13131f] border-t border-white/8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-white/32">© 2025 Remindly. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link
            to="/privacy"
            className="text-sm text-white/32 hover:text-white/60 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="text-sm text-white/32 hover:text-white/60 transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "react-router-dom";

export function DashboardFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 py-4 mt-auto">
      <div className="px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} P Collins. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link to="/products" className="hover:text-[var(--color-brand-primary)] transition">
              Marketplace
            </Link>
            <Link to="/savings" className="hover:text-[var(--color-brand-primary)] transition">
              Savings
            </Link>
            <Link to="/properties" className="hover:text-[var(--color-brand-primary)] transition">
              Real Estate
            </Link>
            <a href="#" className="hover:text-[var(--color-brand-primary)] transition">
              Help
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
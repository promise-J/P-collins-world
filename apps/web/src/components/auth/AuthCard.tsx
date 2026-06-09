import { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const AuthCard = ({ title, subtitle, children, footer }: AuthCardProps) => {
  return (
    <div className="w-full max-w-md animate-slide-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-brand-text)]">{title}</h1>
        {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {children}
        {footer && (
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
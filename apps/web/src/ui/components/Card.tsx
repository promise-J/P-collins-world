interface Props {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: Props) {
  return (
    <div
      className={`
        rounded-xl border border-gray-100
        bg-white p-6 shadow-sm
        ${hover ? "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
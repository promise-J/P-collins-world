import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  retry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description,
  retry
}: ErrorStateProps) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        py-16
        text-center
      "
    >
      <AlertTriangle
        size={50}
        className="text-red-500"
      />

      <h3 className="mt-4 font-semibold">
        {title}
      </h3>

      {description && (
        <p className="mt-2 text-slate-500">
          {description}
        </p>
      )}

      {retry && (
        <button
          onClick={retry}
          className="
            mt-4
            rounded-lg
            bg-slate-900
            px-4
            py-2
            text-white
          "
        >
          Retry
        </button>
      )}
    </div>
  );
}
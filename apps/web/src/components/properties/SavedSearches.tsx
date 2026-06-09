import { useSavedSearches } from "@/hooks/useSavedSearches";

export function SavedSearches() {
  const searches = useSavedSearches((state) => state.searches);

  return (
    <div
      className="
       space-y-3
      "
    >
      {searches.map((search) => (
        <div
          key={search.id}
          className="
         rounded-lg
         border
         p-4
        "
        >
          {search.name}
        </div>
      ))}
    </div>
  );
}

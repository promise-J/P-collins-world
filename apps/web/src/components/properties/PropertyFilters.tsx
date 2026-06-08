import { useState } from 'react';

interface PropertyFiltersProps {
  onFilterChange?: (key: string, value: string) => void;
  initialFilters?: {
    type?: string;
    city?: string;
    bedrooms?: string;
    status?: string;
  };
}

export function PropertyFilters({ onFilterChange, initialFilters }: PropertyFiltersProps) {
  const [propertyType, setPropertyType] = useState(initialFilters?.type || '');
  const [city, setCity] = useState(initialFilters?.city || '');
  const [bedrooms, setBedrooms] = useState(initialFilters?.bedrooms || '');
  const [status, setStatus] = useState(initialFilters?.status || 'AVAILABLE');

  const handleTypeChange = (value: string) => {
    setPropertyType(value);
    onFilterChange?.('type', value);
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    onFilterChange?.('city', value);
  };

  const handleBedroomsChange = (value: string) => {
    setBedrooms(value);
    onFilterChange?.('bedrooms', value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange?.('status', value);
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <select
        value={propertyType}
        onChange={(e) => handleTypeChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
      >
        <option value="">Property Type</option>
        <option value="APARTMENT">Apartment</option>
        <option value="HOUSE">House</option>
        <option value="LAND">Land</option>
        <option value="COMMERCIAL">Commercial</option>
      </select>

      <select
        value={city}
        onChange={(e) => handleCityChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
      >
        <option value="">City</option>
        <option value="Lagos">Lagos</option>
        <option value="Abuja">Abuja</option>
        <option value="Port Harcourt">Port Harcourt</option>
        <option value="Kano">Kano</option>
        <option value="Ibadan">Ibadan</option>
      </select>

      <select
        value={bedrooms}
        onChange={(e) => handleBedroomsChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
      >
        <option value="">Bedrooms</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4+</option>
      </select>

      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
      >
        <option value="AVAILABLE">Available</option>
        <option value="RESERVED">Reserved</option>
        <option value="OCCUPIED">Occupied</option>
      </select>
    </div>
  );
}
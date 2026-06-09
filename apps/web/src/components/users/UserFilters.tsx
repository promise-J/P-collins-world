export function UserFilters() {
  return (
    <div
      className="
     grid
     gap-4
     md:grid-cols-4
    "
    >
      <input placeholder="Search" />

      <select>
        <option>All Roles</option>
      </select>

      <select>
        <option>KYC Status</option>
      </select>

      <select>
        <option>Account Status</option>
      </select>
    </div>
  );
}

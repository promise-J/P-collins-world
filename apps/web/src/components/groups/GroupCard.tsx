export function GroupCard({ group }: any) {
  return (
    <div>
      <h3>{group.name}</h3>

      <p>
        Members:
        {group.membersCount}
      </p>
    </div>
  );
}

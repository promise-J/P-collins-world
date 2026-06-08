interface Props {
    role: string;
    allowedRoles: string[];
    children: React.ReactNode;
  }
  
  export function RoleGuard({
    role,
    allowedRoles,
    children
  }: Props) {
    if (
      !allowedRoles.includes(role)
    ) {
      return (
        <div>
          Access Denied
        </div>
      );
    }
  
    return <>{children}</>;
  }
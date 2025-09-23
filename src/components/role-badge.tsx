import { Badge } from "@/components/ui/badge"
import type { UserRole } from "@/lib/types"

interface RoleBadgeProps {
  role: UserRole
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const getRoleVariant = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "manager":
        return "default"
      case "employee":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Admin"
      case "manager":
        return "Manager"
      case "employee":
        return "Employee"
      default:
        return role
    }
  }

  return (
    <Badge variant={getRoleVariant(role)}>
      {getRoleLabel(role)}
    </Badge>
  )
}

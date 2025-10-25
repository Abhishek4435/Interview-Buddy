import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
interface StatusBadgeProps {
  status: "active" | "inactive" | "admin" | "co-admin" | "user";
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getVariant = () => {
    switch (status) {
      case "active":
      case "admin":
        return "default";
      case "inactive":
      case "co-admin":
        return "secondary";
      case "user":
        return "outline";
      default:
        return "outline";
    }
  };

  const getColorClass = () => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground hover:bg-success/90";
      case "inactive":
        return "bg-warning text-warning-foreground hover:bg-warning/90";
      case "admin":
        return "bg-success text-success-foreground hover:bg-success/90";
      case "co-admin":
        return "bg-warning text-warning-foreground hover:bg-warning/90";
      case "user":
        return "bg-secondary text-secondary-foreground hover:bg-secondary/90";
      default:
        return "";
    }
  };

  return (
    <Badge
      variant={getVariant()}
      className={cn(getColorClass(), "capitalize", className)}
    >
      {status}
    </Badge>
  );
};

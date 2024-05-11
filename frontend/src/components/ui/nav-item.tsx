import { cn } from "@/lib/utils";
import type { IconType } from "react-icons";
import { Link, useLocation } from "react-router-dom";

type NavProps = {
  path: string;
  title: string;
  exact?: boolean;
  icon: IconType;
};

const Nav = ({ path, title, exact, icon: Icon }: NavProps) => {
  const { pathname } = useLocation();
  const isActive = exact ? pathname === path : pathname.startsWith(path);

  return (
    <Link
      to={path}
      className={cn(
        "w-full flex items-center text-sm rounded-lg px-4 h-10 md:h-12 transition-colors",
        isActive
          ? "bg-primary-500 text-white hover:bg-primary-500/90"
          : "text-gray-500 hover:bg-primary-100/80 hover:text-primary-600"
      )}
    >
      {Icon ? (
        <div className="w-8 overflow-hidden">
          <Icon className="text-xl" />
        </div>
      ) : null}
      {title}
    </Link>
  );
};
export default Nav;

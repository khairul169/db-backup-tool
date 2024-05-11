import {
  IoCogOutline,
  IoLogOutOutline,
  IoPieChartOutline,
  IoServerOutline,
} from "react-icons/io5";
import Nav from "../ui/nav-item";
import Button from "../ui/button";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const isOpen = false;

  return (
    <div
      className={cn(
        "w-[220px] flex flex-col h-full bg-white overflow-hidden fixed md:static left-0 top-0 bottom-0 transition-all md:!translate-x-0 z-10",
        !isOpen ? "-translate-x-full" : ""
      )}
    >
      <div className="px-2 py-8 text-center">
        <p className="text-3xl font-bold font-mono text-primary-500">Serep</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 space-y-2">
        <Nav path="/" exact title="Overview" icon={IoPieChartOutline} />
        <Nav path="/servers" title="Servers" icon={IoServerOutline} />
        <Nav path="/settings" title="Settings" icon={IoCogOutline} />
      </nav>

      <div className="mx-2 py-2 md:py-4 border-t border-gray-200">
        <Button className="w-full justify-start" variant="ghost">
          <IoLogOutOutline className="text-xl" /> Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

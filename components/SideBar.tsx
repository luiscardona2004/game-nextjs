"use client";
import { UserButton } from "@stackframe/stack";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import { SquaresFourIcon, JoystickIcon, PlusIcon, GearIcon, ComputerTowerIcon } from "@phosphor-icons/react";

export default function SideBar({
    currentPath = "/dashboard",
    children

}:{currentPath: string;
    children:React.ReactNode;
}) {
    const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: SquaresFourIcon },
    { name: "Games",     href: "/games",     icon: JoystickIcon },
    { name: "Console",   href: "/consoles",  icon: ComputerTowerIcon },
    { name: "Settings",  href: "/settings",  icon: GearIcon },
  ];
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <nav className="navbar w-full bg-base-300">
                    <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
                        </svg>
                    </label>
                    <div className="px-4 flex gap-2 justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M176,112H152a8,8,0,0,1,0-16h24a8,8,0,0,1,0,16ZM104,96H96V88a8,8,0,0,0-16,0v8H72a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0v-8h8a8,8,0,0,0,0-16ZM241.48,200.65a36,36,0,0,1-54.94,4.81c-.12-.12-.24-.24-.35-.37L146.48,160h-37L69.81,205.09l-.35.37A36.08,36.08,0,0,1,44,216,36,36,0,0,1,8.56,173.75a.68.68,0,0,1,0-.14L24.93,89.52A59.88,59.88,0,0,1,83.89,40H172a60.08,60.08,0,0,1,59,49.25c0,.06,0,.12,0,.18l16.37,84.17a.68.68,0,0,1,0,.14A35.74,35.74,0,0,1,241.48,200.65ZM172,144a44,44,0,0,0,0-88H83.89A43.9,43.9,0,0,0,40.68,92.37l0,.13L24.3,176.59A20,20,0,0,0,58,194.3l41.92-47.59a8,8,0,0,1,6-2.71Zm59.7,32.59-8.74-45A60,60,0,0,1,172,160h-4.2L198,194.31a20.09,20.09,0,0,0,17.46,5.39,20,20,0,0,0,16.23-23.11Z"></path>
                        </svg>
                        GameNextJS
                    </div>
                    <div className="ms-auto flex items-center gap-3">
                        <SignOutButton />
                        <UserButton showUserInfo />
                    </div>     
                </nav>
                {/* Page content here */}
                <div className="p-4">{children}</div>
            </div>

            <div className="drawer-side is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                    <div className="menu w-full grow space-y-2">
                        {navigation.map((item, key) => {
                            const IconComponent = item.icon;
                            const isActive = currentPath === item.href;
                            return (
                                    <Link
                                    href={item.href}
                                    key={key}
                                    data-tip={item.name}
                                    className={`flex gap-x-2 items-center py-2 px-2 rounded-lg is-drawer-close:tooltip is-drawer-close:tooltip-right ${
                                        isActive
                                        ? "bg-purple-600 text-purple-200"
                                        : "hover:bg-white/10 text-white"
                                    }`}
                                    >
                                    <IconComponent className="size-5" />
                                    <span className="text-sm is-drawer-close:hidden">{item.name}</span>
                                    </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

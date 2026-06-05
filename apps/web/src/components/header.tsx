"use client";
import { Button } from "@darasa-lako/ui/components/button";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
	// const links = [
	//   { to: "/", label: "Home" },
	//   { to: "/dashboard", label: "Dashboard" },
	// ] as const;

	return (
		<div className="fixed inset-x-4 top-6 z-50 mx-auto h-16 max-w-(--breakpoint-xl) rounded-full border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto flex h-full items-center justify-between px-4 py-1">
				<nav className="flex gap-4 text-lg">
					<div>
						<Link href="/" className="text-bold text-primary">
							Darasa Lako
						</Link>
					</div>
					{/* {links.map(({ to, label }) => {
            return (
              <Link key={to} href={to}>
                {label}
              </Link>
            );
          })} */}
				</nav>
				<div className="flex items-center gap-3">
					<ModeToggle />
					<Button
						className="rounded-full"
						nativeButton={false}
						render={<Link href="/dashboard" />}
					>
						Dashboard
					</Button>

					{/* Mobile Menu */}
					{/* <div className="md:hidden">
            <NavigationSheet />
          </div> */}
				</div>
				{/* <div className="flex items-center gap-2">
          <ModeToggle />
          <UserMenu />
        </div> */}
			</div>
			<hr />
		</div>
	);
}

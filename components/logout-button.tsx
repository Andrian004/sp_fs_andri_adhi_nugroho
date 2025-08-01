import { logout } from "@/actions/authenticate";

export function LogoutButton({ children }: { children: React.ReactNode }) {
  return (
    <form action={logout}>
      <button
        className="flex bg-transparent border-none outline-none gap-x-2"
        type="submit"
      >
        {children}
      </button>
    </form>
  );
}

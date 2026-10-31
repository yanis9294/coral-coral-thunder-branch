import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tdi")({
  beforeLoad: () => {
    throw redirect({ to: "/invest" });
  },
});

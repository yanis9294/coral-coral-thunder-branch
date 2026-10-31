import { createFileRoute } from "@tanstack/react-router";
import { WatchView } from "@/components/intel/watch-view";

export const Route = createFileRoute("/watch")({ component: WatchView });

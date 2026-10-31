import { createFileRoute } from "@tanstack/react-router";
import { MacroView } from "@/components/intel/calculated-views";

export const Route = createFileRoute("/macro")({ component: MacroView });

import { createFileRoute } from "@tanstack/react-router";
import { InvestView } from "@/components/intel/invest-view";

export const Route = createFileRoute("/invest")({ component: InvestView });

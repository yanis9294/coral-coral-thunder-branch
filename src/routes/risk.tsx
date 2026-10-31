import { createFileRoute } from "@tanstack/react-router";
import { RiskView } from "@/components/intel/risk-view";

export const Route = createFileRoute("/risk")({ component: RiskView });

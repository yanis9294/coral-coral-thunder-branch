import { createFileRoute } from "@tanstack/react-router";
import { StirView } from "@/components/intel/stir-view";

export const Route = createFileRoute("/stir")({ component: StirView });

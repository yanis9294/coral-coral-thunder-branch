import { createFileRoute } from "@tanstack/react-router";
import { WorkbenchView } from "@/components/intel/calculated-views";

export const Route = createFileRoute("/workbench")({ component: WorkbenchView });

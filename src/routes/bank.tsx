import { createFileRoute } from "@tanstack/react-router";
import { BankView } from "@/components/intel/bank-view";

export const Route = createFileRoute("/bank")({ component: BankView });

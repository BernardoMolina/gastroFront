"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ConsultaDTO } from "@/lib/types/consulta";

interface DetalheConsultaDialogProps {
  consulta: ConsultaDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatData(dataa: string) {
  if (!dataa) return "-";
  const date = new Date(dataa);
  if (isNaN(date.getTime())) return dataa;
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface InfoBlockProps {
  label: string;
  value?: string | null;
}

function InfoBlock({ label, value }: InfoBlockProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <p className="whitespace-pre-wrap rounded-md border bg-muted/40 p-3 text-sm leading-relaxed">
        {value?.trim() ? value : "-"}
      </p>
    </div>
  );
}

export function DetalheConsultaDialog({
  consulta,
  open,
  onOpenChange,
}: DetalheConsultaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Consulta</DialogTitle>
          <DialogDescription>
            {consulta
              ? `${consulta.nomepaciente} • ${formatData(consulta.dataa)}`
              : ""}
          </DialogDescription>
        </DialogHeader>

        {consulta && (
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoBlock label="Paciente" value={consulta.nomepaciente} />
              <InfoBlock label="Médico" value={consulta.nomemedico} />
            </div>
            <InfoBlock label="Sintoma" value={consulta.sintoma} />
            <InfoBlock label="Prescrição" value={consulta.prescricao} />
            <InfoBlock label="Observação" value={consulta.observacao} />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

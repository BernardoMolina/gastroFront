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
import { Badge } from "@/components/ui/badge";
import { TIPO_EXAME_LABEL, type ExameUnificado } from "@/lib/types/exame";

interface DetalheExameDialogProps {
  exame: ExameUnificado | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CAMPO_LABEL: Record<string, string> = {
  diagnostico: "Diagnóstico",
  tecnica: "Técnica",
  observacao: "Observação",
  sumario: "Sumário",
  conclusao: "Conclusão",
  resultados: "Resultados",
  esofago: "Esôfago",
  duodeno: "Duodeno",
  descricao: "Descrição",
};

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

export function DetalheExameDialog({
  exame,
  open,
  onOpenChange,
}: DetalheExameDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalhes do Exame
            {exame && (
              <Badge variant="secondary">{TIPO_EXAME_LABEL[exame.tipo]}</Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {exame
              ? `${exame.nomepaciente} • ${formatData(exame.dataexame)}`
              : ""}
          </DialogDescription>
        </DialogHeader>

        {exame && (
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoBlock label="Paciente" value={exame.nomepaciente} />
              <InfoBlock label="Médico" value={exame.nomemedico} />
            </div>
            {Object.entries(exame.campos).map(([key, value]) => (
              <InfoBlock key={key} label={CAMPO_LABEL[key] ?? key} value={value} />
            ))}
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

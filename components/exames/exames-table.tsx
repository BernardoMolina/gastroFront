"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  FlaskConical,
  Stethoscope,
  User,
  CalendarClock,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TIPO_EXAME_LABEL,
  type ExameUnificado,
  type TipoExame,
} from "@/lib/types/exame";
import { DetalheExameDialog } from "@/components/exames/detalhe-exame-dialog";

interface ExamesTableProps {
  exames: ExameUnificado[];
  onEdit: (exame: ExameUnificado) => void;
  onDelete: (exame: ExameUnificado) => void;
  onAdd: () => void;
  /** Quando true, oculta cadastro/edição/exclusão (visão do paciente). */
  readOnly?: boolean;
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

function resumoCampos(exame: ExameUnificado) {
  const valores = Object.values(exame.campos).filter(Boolean);
  return valores.join(" • ") || "-";
}

export function ExamesTable({
  exames,
  onEdit,
  onDelete,
  onAdd,
  readOnly = false,
}: ExamesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<TipoExame | "TODOS">("TODOS");
  const [detalheExame, setDetalheExame] = useState<ExameUnificado | null>(null);

  const filteredExames = exames.filter((e) => {
    const matchTipo = filtroTipo === "TODOS" || e.tipo === filtroTipo;
    const termo = searchTerm.toLowerCase();
    const matchTermo =
      e.nomepaciente?.toLowerCase().includes(termo) ||
      e.nomemedico?.toLowerCase().includes(termo) ||
      resumoCampos(e).toLowerCase().includes(termo);
    return matchTipo && matchTermo;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FlaskConical className="h-6 w-6" />
              Gestão de Exames
            </CardTitle>
            <CardDescription>
              {readOnly
                ? "Visualize os seus exames realizados"
                : "Gerencie os exames realizados na clínica"}
            </CardDescription>
          </div>
          {!readOnly && (
            <Button onClick={onAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Exame
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por paciente, médico ou resultado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filtroTipo}
            onValueChange={(v) => setFiltroTipo(v as TipoExame | "TODOS")}
          >
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos os tipos</SelectItem>
              <SelectItem value="COLANGIORESSONANCIA">
                Colangiorressonância
              </SelectItem>
              <SelectItem value="MANOMETRIA">Manometria</SelectItem>
              <SelectItem value="ENDOSCOPIA">Endoscopia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredExames.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FlaskConical className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">
              Nenhum exame encontrado
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm || filtroTipo !== "TODOS"
                ? "Tente ajustar sua busca ou filtro"
                : 'Clique em "Novo Exame" para registrar'}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Médico</TableHead>
                  <TableHead>Resultado</TableHead>
                  {!readOnly && (
                    <TableHead className="text-right">Ações</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExames.map((exame, index) => (
                  <TableRow key={`${exame.tipo}-${exame.id ?? index}`}>
                    <TableCell>
                      <Badge variant="secondary">
                        {TIPO_EXAME_LABEL[exame.tipo]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium">
                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                        {formatData(exame.dataexame)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {exame.nomepaciente}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                        {exame.nomemedico}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDetalheExame(exame)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Visualizar
                      </Button>
                    </TableCell>
                    {!readOnly && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(exame)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(exame)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          {filteredExames.length} exame(s) encontrado(s)
        </div>
      </CardContent>

      <DetalheExameDialog
        exame={detalheExame}
        open={!!detalheExame}
        onOpenChange={(open) => !open && setDetalheExame(null)}
      />
    </Card>
  );
}

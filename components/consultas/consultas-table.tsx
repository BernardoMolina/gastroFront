"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  CalendarClock,
  Stethoscope,
  User,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DetalheConsultaDialog } from "@/components/consultas/detalhe-consulta-dialog";
import type { ConsultaDTO } from "@/lib/types/consulta";

interface ConsultasTableProps {
  consultas: ConsultaDTO[];
  onEdit: (consulta: ConsultaDTO) => void;
  onDelete: (consulta: ConsultaDTO) => void;
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

export function ConsultasTable({ consultas, onEdit, onDelete, onAdd, readOnly = false }: ConsultasTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [detalheConsulta, setDetalheConsulta] = useState<ConsultaDTO | null>(null);

  const filteredConsultas = consultas.filter(
    (c) =>
      c.nomepaciente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nomemedico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.sintoma?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CalendarClock className="h-6 w-6" />
              Gestão de Consultas
            </CardTitle>
            <CardDescription>
              {readOnly
                ? "Visualize as suas consultas agendadas"
                : "Gerencie as consultas agendadas no sistema"}
            </CardDescription>
          </div>
          {!readOnly && (
            <Button onClick={onAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Consulta
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por paciente, médico ou sintoma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredConsultas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarClock className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Nenhuma consulta encontrada</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm
                ? "Tente ajustar sua busca"
                : 'Clique em "Nova Consulta" para agendar'}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Médico</TableHead>
                  <TableHead>Consulta</TableHead>
                  {!readOnly && <TableHead className="text-right">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConsultas.map((consulta) => (
                  <TableRow key={consulta.idcon}>
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium">
                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                        {formatData(consulta.dataa)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {consulta.nomepaciente}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                        {consulta.nomemedico}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDetalheConsulta(consulta)}
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
                            onClick={() => onEdit(consulta)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(consulta)}
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
          {filteredConsultas.length} consulta(s) encontrada(s)
        </div>
      </CardContent>

      <DetalheConsultaDialog
        consulta={detalheConsulta}
        open={!!detalheConsulta}
        onOpenChange={(open) => !open && setDetalheConsulta(null)}
      />
    </Card>
  );
}

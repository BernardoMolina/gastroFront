"use client";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Stethoscope, Mail, Phone, FileText } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MedicoDTO } from "@/lib/types/medico";

interface MedicosTableProps {
  medicos: MedicoDTO[];
  onEdit: (medico: MedicoDTO) => void;
  onDelete: (medico: MedicoDTO) => void;
  onAdd: () => void;
}

export function MedicosTable({ medicos, onEdit, onDelete, onAdd }: MedicosTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMedicos = medicos.filter(
    (medico) =>
      medico.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medico.registro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medico.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medico.cpf?.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "ativo" || statusLower === "true") {
      return <Badge className="bg-emerald-500 hover:bg-emerald-600">Ativo</Badge>;
    }
    return <Badge variant="secondary">Inativo</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Stethoscope className="h-6 w-6" />
              Gestão de Médicos
            </CardTitle>
            <CardDescription>
              Gerencie os médicos cadastrados no sistema
            </CardDescription>
          </div>
          <Button onClick={onAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Médico
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, CRM, email ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredMedicos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Stethoscope className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Nenhum médico encontrado</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm
                ? "Tente ajustar sua busca"
                : "Clique em \"Novo Médico\" para cadastrar"}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CRM/Registro</TableHead>
                  <TableHead className="hidden md:table-cell">Contato</TableHead>
                  <TableHead className="hidden lg:table-cell">CPF</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedicos.map((medico) => (
                  <TableRow key={medico.idmed}>
                    <TableCell>
                      <div className="font-medium">{medico.nome_completo}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {medico.registro}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {medico.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {medico.telefone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {medico.cpf}
                    </TableCell>
                    <TableCell>{getStatusBadge(medico.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(medico)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(medico)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          {filteredMedicos.length} médico(s) encontrado(s)
        </div>
      </CardContent>
    </Card>
  );
}

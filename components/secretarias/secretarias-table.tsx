"use client";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2, UserCog, Mail, Phone } from "lucide-react";
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
import type { UsuarioDTO } from "@/lib/types/secretaria";

interface SecretariasTableProps {
  secretarias: UsuarioDTO[];
  onEdit: (secretaria: UsuarioDTO) => void;
  onDelete: (secretaria: UsuarioDTO) => void;
  onAdd: () => void;
}

export function SecretariasTable({ secretarias, onEdit, onDelete, onAdd }: SecretariasTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSecretarias = secretarias.filter(
    (secretaria) =>
      secretaria.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      secretaria.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      secretaria.cpf?.includes(searchTerm)
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
              <UserCog className="h-6 w-6" />
              Gestão de Secretárias
            </CardTitle>
            <CardDescription>
              Gerencie as secretárias cadastradas no sistema
            </CardDescription>
          </div>
          <Button onClick={onAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Secretária
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredSecretarias.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <UserCog className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Nenhuma secretária encontrada</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm
                ? "Tente ajustar sua busca"
                : "Clique em \"Nova Secretária\" para cadastrar"}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Contato</TableHead>
                  <TableHead className="hidden lg:table-cell">CPF</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSecretarias.map((secretaria, index) => (
                  <TableRow key={secretaria.idus ?? `sec-${index}`}>
                    <TableCell>
                      <div className="font-medium">{secretaria.nome_completo}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {secretaria.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {secretaria.telefone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {secretaria.cpf}
                    </TableCell>
                    <TableCell>{getStatusBadge(secretaria.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(secretaria)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(secretaria)}
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
          {filteredSecretarias.length} secretária(s) encontrada(s)
        </div>
      </CardContent>
    </Card>
  );
}

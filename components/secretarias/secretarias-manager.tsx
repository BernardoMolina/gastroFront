"use client";

import { useState, useEffect } from "react";
import { SecretariasTable } from "@/components/secretarias/secretarias-table";
import { SecretariaFormModal } from "@/components/secretarias/secretaria-form-modal";
import { DeleteSecretariaDialog } from "@/components/secretarias/delete-secretaria-dialog";
import {
  getSecretarias,
  salvarSecretaria,
  atualizarSecretaria,
  deletarSecretaria,
} from "@/lib/api/secretaria-api";
import type { UsuarioDTO } from "@/lib/types/secretaria";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export function SecretariasManager() {
  const [secretarias, setSecretarias] = useState<UsuarioDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSecretaria, setSelectedSecretaria] = useState<UsuarioDTO | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchSecretarias = async () => {
    try {
      setIsLoading(true);
      const data = await getSecretarias();
      setSecretarias(data);
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as secretárias. Verifique se a API está disponível.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSecretarias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setSelectedSecretaria(null);
    setIsFormOpen(true);
  };

  const handleEdit = (secretaria: UsuarioDTO) => {
    setSelectedSecretaria(secretaria);
    setIsFormOpen(true);
  };

  const handleDelete = (secretaria: UsuarioDTO) => {
    setSelectedSecretaria(secretaria);
    setIsDeleteOpen(true);
  };

  const handleSave = async (data: {
    idus?: number;
    nome_completo: string;
    email: string;
    cpf: string;
    telefone: string;
    senha?: string;
    permissao: string;
    status: string;
  }) => {
    try {
      setIsSaving(true);
      if (data.idus) {
        await atualizarSecretaria(data);
        toast({
          title: "Sucesso",
          description: "Secretária atualizada com sucesso!",
        });
      } else {
        await salvarSecretaria(data);
        toast({
          title: "Sucesso",
          description: "Secretária cadastrada com sucesso!",
        });
      }
      setIsFormOpen(false);
      await fetchSecretarias();
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a secretária.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSecretaria?.idus) return;

    try {
      setIsSaving(true);
      await deletarSecretaria(selectedSecretaria.idus);
      toast({
        title: "Sucesso",
        description: "Secretária excluída com sucesso!",
      });
      setIsDeleteOpen(false);
      await fetchSecretarias();
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a secretária.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Carregando secretárias...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SecretariasTable
        secretarias={secretarias}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <SecretariaFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        secretaria={selectedSecretaria}
        onSave={handleSave}
        isLoading={isSaving}
      />

      <DeleteSecretariaDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        secretariaNome={selectedSecretaria?.nome_completo || ""}
        onConfirm={handleConfirmDelete}
        isLoading={isSaving}
      />

      <Toaster />
    </>
  );
}

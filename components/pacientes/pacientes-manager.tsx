"use client";

import { useState, useEffect } from "react";
import { PacientesTable } from "@/components/pacientes/pacientes-table";
import { PacienteFormModal } from "@/components/pacientes/paciente-form-modal";
import { DeletePacienteDialog } from "@/components/pacientes/delete-paciente-dialog";
import {
  getDetalhesPacientes,
  salvarPaciente,
  atualizarPaciente,
  deletarPaciente,
} from "@/lib/api/paciente-api";
import type { InfoTodosPacientesDTO } from "@/lib/types/paciente";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export function PacientesManager() {
  const [pacientes, setPacientes] = useState<InfoTodosPacientesDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<InfoTodosPacientesDTO | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchPacientes = async () => {
    try {
      setIsLoading(true);
      const data = await getDetalhesPacientes();
      setPacientes(data);
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pacientes. Verifique se a API está disponível.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setSelectedPaciente(null);
    setIsFormOpen(true);
  };

  const handleEdit = (paciente: InfoTodosPacientesDTO) => {
    setSelectedPaciente(paciente);
    setIsFormOpen(true);
  };

  const handleDelete = (paciente: InfoTodosPacientesDTO) => {
    setSelectedPaciente(paciente);
    setIsDeleteOpen(true);
  };

  const handleSave = async (data: {
    idpac?: number;
    funcao: string;
    sangue: string;
    plano_de_saude: string;
    med_uso_cont: string;
    condicao_cronica: string;
    doenca_anterior: string;
    doenca_infec: string;
    cirurgia: string;
    data_de_nasc: string;
    alergia: string;
    historico_familiar: string;
    sexo: string;
    imunizacao: string;
    usuario: {
      idus?: number;
      nome_completo: string;
      email: string;
      cpf: string;
      telefone: string;
      senha?: string;
      status: string;
      permissao: string;
    };
  }) => {
    try {
      setIsSaving(true);
      if (data.idpac) {
        await atualizarPaciente(data as any);
        toast({
          title: "Sucesso",
          description: "Paciente atualizado com sucesso!",
        });
      } else {
        await salvarPaciente(data as any);
        toast({
          title: "Sucesso",
          description: "Paciente cadastrado com sucesso!",
        });
      }
      setIsFormOpen(false);
      await fetchPacientes();
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o paciente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedPaciente?.idpac) return;

    try {
      setIsSaving(true);
      await deletarPaciente(parseInt(selectedPaciente.idpac));
      toast({
        title: "Sucesso",
        description: "Paciente excluído com sucesso!",
      });
      setIsDeleteOpen(false);
      await fetchPacientes();
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o paciente.",
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
          <p className="text-muted-foreground">Carregando pacientes...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PacientesTable
        pacientes={pacientes}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <PacienteFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        paciente={selectedPaciente}
        onSave={handleSave}
        isLoading={isSaving}
      />

      <DeletePacienteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        pacienteNome={selectedPaciente?.nome_completo || ""}
        onConfirm={handleConfirmDelete}
        isLoading={isSaving}
      />

      <Toaster />
    </>
  );
}

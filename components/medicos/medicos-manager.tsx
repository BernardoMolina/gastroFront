"use client";

import { useState, useEffect } from "react";
import { MedicosTable } from "@/components/medicos/medicos-table";
import { MedicoFormModal } from "@/components/medicos/medico-form-modal";
import { DeleteMedicoDialog } from "@/components/medicos/delete-medico-dialog";
import { getMedicos, salvarMedico, atualizarMedico, deletarMedico } from "@/lib/api/medico-api";
import type { MedicoDTO } from "@/lib/types/medico";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export function MedicosManager() {
  const [medicos, setMedicos] = useState<MedicoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMedico, setSelectedMedico] = useState<MedicoDTO | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchMedicos = async () => {
    try {
      setIsLoading(true);
      const data = await getMedicos();
      setMedicos(data);
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os médicos. Verifique se a API está disponível.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setSelectedMedico(null);
    setIsFormOpen(true);
  };

  const handleEdit = (medico: MedicoDTO) => {
    setSelectedMedico(medico);
    setIsFormOpen(true);
  };

  const handleDelete = (medico: MedicoDTO) => {
    setSelectedMedico(medico);
    setIsDeleteOpen(true);
  };

  const handleSave = async (data: {
    idmed?: number;
    registro: string;
    usuario: {
      idus?: number;
      nome_completo: string;
      email: string;
      cpf: string;
      telefone: string;
      senha?: string;
    };
  }) => {
    try {
      setIsSaving(true);
      if (data.idmed) {
        await atualizarMedico({
          idmed: data.idmed,
          registro: data.registro,
          usuario: data.usuario as any,
        });
        toast({
          title: "Sucesso",
          description: "Médico atualizado com sucesso!",
        });
      } else {
        await salvarMedico({
          registro: data.registro,
          usuario: data.usuario as any,
        });
        toast({
          title: "Sucesso",
          description: "Médico cadastrado com sucesso!",
        });
      }
      setIsFormOpen(false);
      await fetchMedicos();
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o médico.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedMedico) return;

    try {
      setIsSaving(true);
      await deletarMedico(parseInt(selectedMedico.idmed));
      toast({
        title: "Sucesso",
        description: "Médico excluído com sucesso!",
      });
      setIsDeleteOpen(false);
      await fetchMedicos();
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o médico.",
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
          <p className="text-muted-foreground">Carregando médicos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MedicosTable
        medicos={medicos}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <MedicoFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        medico={selectedMedico}
        onSave={handleSave}
        isLoading={isSaving}
      />

      <DeleteMedicoDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        medicoNome={selectedMedico?.nome_completo || ""}
        onConfirm={handleConfirmDelete}
        isLoading={isSaving}
      />

      <Toaster />
    </>
  );
}

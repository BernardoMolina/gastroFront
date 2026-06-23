"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { ConsultasTable } from "@/components/consultas/consultas-table";
import { ConsultaFormModal } from "@/components/consultas/consulta-form-modal";
import { DeleteConsultaDialog } from "@/components/consultas/delete-consulta-dialog";
import {
  getConsultas,
  salvarConsulta,
  atualizarConsulta,
  deletarConsulta,
} from "@/lib/api/consulta-api";
import { getMedicos } from "@/lib/api/medico-api";
import { getDetalhesPacientes } from "@/lib/api/paciente-api";
import type { ConsultaDTO, ConsultaPayload } from "@/lib/types/consulta";
import type { MedicoDTO } from "@/lib/types/medico";
import type { InfoTodosPacientesDTO } from "@/lib/types/paciente";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export function ConsultasManager() {
  const [consultas, setConsultas] = useState<ConsultaDTO[]>([]);
  const [medicos, setMedicos] = useState<MedicoDTO[]>([]);
  const [pacientes, setPacientes] = useState<InfoTodosPacientesDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedConsulta, setSelectedConsulta] = useState<ConsultaDTO | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const isPaciente = user?.cargo === "PACIENTE";
  const isMedico = user?.cargo === "MEDICO";

  // ID do paciente logado, descoberto casando o email (único) da sessão.
  const meuIdPac = useMemo(() => {
    if (!isPaciente || !user?.email) return null;
    const eu = pacientes.find(
      (p) => p.email?.toLowerCase() === user.email.toLowerCase()
    );
    return eu?.idpac != null ? Number(eu.idpac) : null;
  }, [isPaciente, user?.email, pacientes]);

  // Médico logado (casado pelo email, que é único).
  const euMedico = useMemo(() => {
    if (!isMedico || !user?.email) return null;
    return (
      medicos.find(
        (m) => m.email?.toLowerCase() === user.email.toLowerCase()
      ) ?? null
    );
  }, [isMedico, user?.email, medicos]);

  // Paciente vê só as suas; médico vê só as dele (por ID); secretária veria todas.
  const consultasVisiveis = useMemo(() => {
    if (isPaciente) {
      if (meuIdPac == null) return [];
      return consultas.filter((c) => c.idpaciente === meuIdPac);
    }
    if (isMedico) {
      const meuIdMed = euMedico?.idmed != null ? Number(euMedico.idmed) : null;
      if (meuIdMed == null) return [];
      return consultas.filter((c) => c.idmedico === meuIdMed);
    }
    return consultas;
  }, [isPaciente, isMedico, meuIdPac, euMedico, consultas]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [consultasData, medicosData, pacientesData] = await Promise.all([
        getConsultas(),
        getMedicos(),
        getDetalhesPacientes(),
      ]);
      setConsultas(consultasData);
      setMedicos(medicosData);
      setPacientes(pacientesData);
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as consultas. Verifique se a API está disponível.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setSelectedConsulta(null);
    setIsFormOpen(true);
  };

  const handleEdit = (consulta: ConsultaDTO) => {
    setSelectedConsulta(consulta);
    setIsFormOpen(true);
  };

  const handleDelete = (consulta: ConsultaDTO) => {
    setSelectedConsulta(consulta);
    setIsDeleteOpen(true);
  };

  const handleSave = async (data: ConsultaPayload) => {
    try {
      setIsSaving(true);
      if (data.idcon) {
        await atualizarConsulta(data);
        toast({ title: "Sucesso", description: "Consulta atualizada com sucesso!" });
      } else {
        await salvarConsulta(data);
        toast({ title: "Sucesso", description: "Consulta agendada com sucesso!" });
      }
      setIsFormOpen(false);
      await fetchData();
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a consulta.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedConsulta) return;
    try {
      setIsSaving(true);
      await deletarConsulta(selectedConsulta.idcon);
      toast({ title: "Sucesso", description: "Consulta excluída com sucesso!" });
      setIsDeleteOpen(false);
      await fetchData();
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a consulta.",
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
          <p className="text-muted-foreground">Carregando consultas...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConsultasTable
        consultas={consultasVisiveis}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        readOnly={isPaciente}
      />

      <ConsultaFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        consulta={selectedConsulta}
        medicos={medicos}
        pacientes={pacientes}
        medicoLogadoId={euMedico?.idmed ? String(euMedico.idmed) : undefined}
        onSave={handleSave}
        isLoading={isSaving}
      />

      <DeleteConsultaDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        descricao={
          selectedConsulta
            ? `${selectedConsulta.nomepaciente} - ${selectedConsulta.nomemedico}`
            : ""
        }
        onConfirm={handleConfirmDelete}
        isLoading={isSaving}
      />

      <Toaster />
    </>
  );
}

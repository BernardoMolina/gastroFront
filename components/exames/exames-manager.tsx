"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { ExamesTable } from "@/components/exames/exames-table";
import {
  ExameFormModal,
  type ExameFormData,
} from "@/components/exames/exame-form-modal";
import { DeleteExameDialog } from "@/components/exames/delete-exame-dialog";
import {
  getDetalhesColangio,
  getDetalhesManometria,
  getDetalhesEndoscopia,
  criarExameBase,
  criarColangio,
  criarManometria,
  criarEndoscopia,
  atualizarColangio,
  atualizarManometria,
  atualizarEndoscopia,
  deletarColangio,
  deletarManometria,
  deletarEndoscopia,
} from "@/lib/api/exame-api";
import { getMedicos } from "@/lib/api/medico-api";
import { getDetalhesPacientes } from "@/lib/api/paciente-api";
import { TIPO_EXAME_LABEL, type ExameUnificado } from "@/lib/types/exame";
import type { MedicoDTO } from "@/lib/types/medico";
import type { InfoTodosPacientesDTO } from "@/lib/types/paciente";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export function ExamesManager() {
  const [exames, setExames] = useState<ExameUnificado[]>([]);
  const [medicos, setMedicos] = useState<MedicoDTO[]>([]);
  const [pacientes, setPacientes] = useState<InfoTodosPacientesDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedExame, setSelectedExame] = useState<ExameUnificado | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const isPaciente = user?.cargo === "PACIENTE";
  const isMedico = user?.cargo === "MEDICO";

  // Paciente logado (casado pelo email, que é único)
  const euPaciente = useMemo(() => {
    if (!isPaciente || !user?.email) return null;
    return (
      pacientes.find(
        (p) => p.email?.toLowerCase() === user.email.toLowerCase()
      ) ?? null
    );
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

  // Paciente vê só os seus; médico vê só os dele; secretária veria todos.
  const examesVisiveis = useMemo(() => {
    if (isPaciente) {
      if (!euPaciente) return [];
      const meuId = euPaciente.idpac != null ? Number(euPaciente.idpac) : null;
      return exames.filter((e) =>
        e.idpaciente != null && meuId != null
          ? e.idpaciente === meuId
          : e.nomepaciente === euPaciente.nome_completo
      );
    }
    if (isMedico) {
      if (!euMedico) return [];
      const meuId = euMedico.idmed != null ? Number(euMedico.idmed) : null;
      return exames.filter((e) =>
        e.idmedico != null && meuId != null
          ? e.idmedico === meuId
          : e.nomemedico === euMedico.nome_completo
      );
    }
    return exames;
  }, [isPaciente, isMedico, euPaciente, euMedico, exames]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [colangios, manometrias, endoscopias, medicosData, pacientesData] =
        await Promise.all([
          getDetalhesColangio(),
          getDetalhesManometria(),
          getDetalhesEndoscopia(),
          getMedicos(),
          getDetalhesPacientes(),
        ]);

      const unificados: ExameUnificado[] = [
        ...colangios.map((c) => ({
          tipo: "COLANGIORESSONANCIA" as const,
          id: c.idcol,
          idexame: c.idexame,
          idpaciente: c.idpaciente,
          idmedico: c.idmedico,
          nomepaciente: c.nomepaciente,
          nomemedico: c.nomemedico,
          dataexame: c.dataexame,
          campos: {
            diagnostico: c.diagnostico ?? "",
            tecnica: c.tecnica ?? "",
            observacao: c.observacao ?? "",
          },
        })),
        ...manometrias.map((m) => ({
          tipo: "MANOMETRIA" as const,
          id: m.idman,
          idexame: m.idexame,
          idpaciente: m.idpaciente,
          idmedico: m.idmedico,
          nomepaciente: m.nomepaciente,
          nomemedico: m.nomemedico,
          dataexame: m.dataexame,
          campos: {
            sumario: m.sumario ?? "",
            conclusao: m.conclusao ?? "",
            resultados: m.resultados ?? "",
          },
        })),
        ...endoscopias.map((e) => ({
          tipo: "ENDOSCOPIA" as const,
          id: e.idend,
          idexame: e.idexame,
          idpaciente: e.idpaciente,
          idmedico: e.idmedico,
          nomepaciente: e.nomepaciente,
          nomemedico: e.nomemedico,
          dataexame: e.dataexame,
          campos: {
            esofago: e.esofago ?? "",
            duodeno: e.duodeno ?? "",
            descricao: e.descricao ?? "",
            conclusao: e.conclusao ?? "",
          },
        })),
      ];

      setExames(unificados);
      setMedicos(medicosData);
      setPacientes(pacientesData);
    } catch {
      toast({
        title: "Erro",
        description:
          "Não foi possível carregar os exames. Verifique se a API está disponível.",
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
    setSelectedExame(null);
    setIsFormOpen(true);
  };

  const handleEdit = (exame: ExameUnificado) => {
    setSelectedExame(exame);
    setIsFormOpen(true);
  };

  const handleDelete = (exame: ExameUnificado) => {
    setSelectedExame(exame);
    setIsDeleteOpen(true);
  };

  const criarEspecifico = async (
    tipo: ExameFormData["tipo"],
    idex: number,
    campos: Record<string, string>
  ) => {
    if (tipo === "COLANGIORESSONANCIA") {
      await criarColangio({
        exame: { idex },
        diagnostico: campos.diagnostico,
        tecnica: campos.tecnica,
        observacao: campos.observacao,
      });
    } else if (tipo === "MANOMETRIA") {
      await criarManometria({
        exame: { idex },
        sumario: campos.sumario,
        conclusao: campos.conclusao,
        resultados: campos.resultados,
      });
    } else {
      await criarEndoscopia({
        exame: { idex },
        esofago: campos.esofago,
        duodeno: campos.duodeno,
        descricao: campos.descricao,
        conclusao: campos.conclusao,
      });
    }
  };

  const atualizarEspecifico = async (data: ExameFormData) => {
    const idex = data.idexame!;
    if (data.tipo === "COLANGIORESSONANCIA") {
      await atualizarColangio({
        idcol: data.id,
        exame: { idex },
        diagnostico: data.campos.diagnostico,
        tecnica: data.campos.tecnica,
        observacao: data.campos.observacao,
      });
    } else if (data.tipo === "MANOMETRIA") {
      await atualizarManometria({
        idman: data.id,
        exame: { idex },
        sumario: data.campos.sumario,
        conclusao: data.campos.conclusao,
        resultados: data.campos.resultados,
      });
    } else {
      await atualizarEndoscopia({
        idend: data.id,
        exame: { idex },
        esofago: data.campos.esofago,
        duodeno: data.campos.duodeno,
        descricao: data.campos.descricao,
        conclusao: data.campos.conclusao,
      });
    }
  };

  const handleSave = async (data: ExameFormData) => {
    try {
      setIsSaving(true);

      if (data.id) {
        // edição: precisa do id do tipo e do idexame
        if (!data.idexame || !data.id) {
          toast({
            title: "Edição indisponível",
            description:
              "O backend precisa retornar o id do exame e do tipo na listagem detalhada para permitir edição.",
            variant: "destructive",
          });
          return;
        }
        await atualizarEspecifico(data);
        toast({ title: "Sucesso", description: "Exame atualizado com sucesso!" });
      } else {
        // cadastro em duas etapas
        const base = await criarExameBase({
          medico: { idmed: Number(data.idmed) },
          paciente: { idpac: Number(data.idpac) },
          dataa: data.dataa,
        });
        await criarEspecifico(data.tipo, base.idex, data.campos);
        toast({ title: "Sucesso", description: "Exame registrado com sucesso!" });
      }

      setIsFormOpen(false);
      await fetchData();
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o exame.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedExame) return;
    if (!selectedExame.id) {
      toast({
        title: "Exclusão indisponível",
        description:
          "O backend precisa retornar o id do exame na listagem detalhada para permitir exclusão.",
        variant: "destructive",
      });
      setIsDeleteOpen(false);
      return;
    }
    try {
      setIsSaving(true);
      if (selectedExame.tipo === "COLANGIORESSONANCIA") {
        await deletarColangio(selectedExame.id);
      } else if (selectedExame.tipo === "MANOMETRIA") {
        await deletarManometria(selectedExame.id);
      } else {
        await deletarEndoscopia(selectedExame.id);
      }
      toast({ title: "Sucesso", description: "Exame excluído com sucesso!" });
      setIsDeleteOpen(false);
      await fetchData();
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o exame.",
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
          <p className="text-muted-foreground">Carregando exames...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ExamesTable
        exames={examesVisiveis}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        readOnly={isPaciente}
      />

      <ExameFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        exame={selectedExame}
        medicos={medicos}
        pacientes={pacientes}
        medicoLogadoId={euMedico?.idmed ? String(euMedico.idmed) : undefined}
        onSave={handleSave}
        isLoading={isSaving}
      />

      <DeleteExameDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        descricao={
          selectedExame
            ? `${TIPO_EXAME_LABEL[selectedExame.tipo]} - ${selectedExame.nomepaciente}`
            : ""
        }
        onConfirm={handleConfirmDelete}
        isLoading={isSaving}
      />

      <Toaster />
    </>
  );
}

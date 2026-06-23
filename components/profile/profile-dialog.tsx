"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Pencil, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";
import { useAuth } from "@/components/auth/auth-provider";
import { getMedicos, atualizarMedico } from "@/lib/api/medico-api";
import { getDetalhesPacientes } from "@/lib/api/paciente-api";
import type { MedicoDTO } from "@/lib/types/medico";
import type { InfoTodosPacientesDTO } from "@/lib/types/paciente";
import { useToast } from "@/hooks/use-toast";
import {
  maskCPF,
  maskTelefone,
  validateNome,
  validateEmail,
  validateCPF,
  validateTelefone,
  validateObrigatorio,
} from "@/lib/form-utils";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface InfoRowProps {
  label: string;
  value?: string | null;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm">{value?.trim() ? value : "-"}</span>
    </div>
  );
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [paciente, setPaciente] = useState<InfoTodosPacientesDTO | null>(null);
  const [medico, setMedico] = useState<MedicoDTO | null>(null);

  const [form, setForm] = useState({
    nome_completo: "",
    email: "",
    cpf: "",
    telefone: "",
    registro: "",
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const isPaciente = user?.cargo === "PACIENTE";
  const isMedico = user?.cargo === "MEDICO";

  const carregar = useCallback(async () => {
    if (!user?.email) return;
    setIsLoading(true);
    try {
      const email = user.email.toLowerCase();
      if (isPaciente) {
        const pacientes = await getDetalhesPacientes();
        const eu =
          pacientes.find((p) => p.email?.toLowerCase() === email) ?? null;
        setPaciente(eu);
      } else if (isMedico) {
        const medicos = await getMedicos();
        const eu = medicos.find((m) => m.email?.toLowerCase() === email) ?? null;
        setMedico(eu);
        if (eu) {
          setForm({
            nome_completo: eu.nome_completo || "",
            email: eu.email || "",
            cpf: eu.cpf || "",
            telefone: eu.telefone || "",
            registro: eu.registro || "",
          });
        }
      }
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus dados.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.email, isPaciente, isMedico, toast]);

  useEffect(() => {
    if (open) {
      setIsEditing(false);
      setErrors({});
      carregar();
    }
  }, [open, carregar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let next = value;
    if (name === "cpf") next = maskCPF(value);
    if (name === "telefone") next = maskTelefone(value);
    if (name === "registro") next = value.slice(0, 15);
    setForm((prev) => ({ ...prev, [name]: next }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validar = () => {
    const novos: Record<string, string | undefined> = {
      nome_completo: validateNome(form.nome_completo),
      email: validateEmail(form.email),
      cpf: validateCPF(form.cpf),
      telefone: validateTelefone(form.telefone),
      registro: validateObrigatorio(form.registro, "o CRM / registro"),
    };
    setErrors(novos);
    return !Object.values(novos).some(Boolean);
  };

  const handleSalvar = async () => {
    if (!medico || !validar()) return;
    setIsSaving(true);
    try {
      await atualizarMedico({
        idmed: Number(medico.idmed),
        registro: form.registro,
        usuario: {
          idus: Number(medico.iduser),
          nome_completo: form.nome_completo,
          email: form.email,
          cpf: form.cpf,
          telefone: form.telefone,
          permissao: medico.permissao,
          status: medico.status,
        } as never,
      });
      toast({ title: "Sucesso", description: "Perfil atualizado com sucesso!" });
      setIsEditing(false);
      await carregar();
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seu perfil.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Meu Perfil</DialogTitle>
          <DialogDescription>
            {isPaciente
              ? "Visualize as suas informações cadastrais."
              : "Visualize e edite as suas informações cadastrais."}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : isPaciente ? (
          paciente ? (
            <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
              <InfoRow label="Nome completo" value={paciente.nome_completo} />
              <InfoRow label="Email" value={paciente.email} />
              <InfoRow label="CPF" value={paciente.cpf} />
              <InfoRow label="Telefone" value={paciente.telefone} />
              <InfoRow label="Data de nascimento" value={paciente.data_de_nasc} />
              <InfoRow label="Sexo" value={paciente.sexo} />
              <InfoRow label="Tipo sanguíneo" value={paciente.sangue} />
              <InfoRow label="Plano de saúde" value={paciente.plano_de_saude} />
              <InfoRow label="Função" value={paciente.funcao} />
              <InfoRow label="Status" value={paciente.status} />
              <InfoRow label="Alergias" value={paciente.alergia} />
              <InfoRow
                label="Medicação de uso contínuo"
                value={paciente.med_uso_cont}
              />
              <InfoRow
                label="Condição crônica"
                value={paciente.condicao_cronica}
              />
              <InfoRow label="Doença anterior" value={paciente.doenca_anterior} />
              <InfoRow
                label="Doença infecciosa"
                value={paciente.doenca_infec}
              />
              <InfoRow label="Cirurgias" value={paciente.cirurgia} />
              <InfoRow
                label="Histórico familiar"
                value={paciente.historico_familiar}
              />
              <InfoRow label="Imunização" value={paciente.imunizacao} />
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Não encontramos um cadastro de paciente vinculado ao seu email.
            </p>
          )
        ) : medico ? (
          isEditing ? (
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="nome_completo">Nome completo</Label>
                <Input
                  id="nome_completo"
                  name="nome_completo"
                  value={form.nome_completo}
                  onChange={handleChange}
                  aria-invalid={!!errors.nome_completo}
                />
                <FieldError message={errors.nome_completo} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="registro">CRM / Registro</Label>
                <Input
                  id="registro"
                  name="registro"
                  value={form.registro}
                  onChange={handleChange}
                  maxLength={15}
                  aria-invalid={!!errors.registro}
                />
                <FieldError message={errors.registro} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                  />
                  <FieldError message={errors.email} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    inputMode="numeric"
                    value={form.telefone}
                    onChange={handleChange}
                    aria-invalid={!!errors.telefone}
                  />
                  <FieldError message={errors.telefone} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  inputMode="numeric"
                  value={form.cpf}
                  onChange={handleChange}
                  aria-invalid={!!errors.cpf}
                />
                <FieldError message={errors.cpf} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
              <InfoRow label="Nome completo" value={medico.nome_completo} />
              <InfoRow label="CRM / Registro" value={medico.registro} />
              <InfoRow label="Email" value={medico.email} />
              <InfoRow label="Telefone" value={medico.telefone} />
              <InfoRow label="CPF" value={medico.cpf} />
              <InfoRow label="Status" value={medico.status} />
            </div>
          )
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Não encontramos um cadastro de médico vinculado ao seu email.
          </p>
        )}

        <DialogFooter>
          {isMedico && medico && !isEditing && (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
          )}
          {isMedico && medico && isEditing && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setErrors({});
                  carregar();
                }}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
              <Button onClick={handleSalvar} disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </>
          )}
          {!isEditing && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

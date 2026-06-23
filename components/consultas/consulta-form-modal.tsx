"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldError } from "@/components/ui/field-error";
import { PacienteCombobox } from "@/components/ui/paciente-combobox";
import type { ConsultaDTO, ConsultaPayload } from "@/lib/types/consulta";
import type { MedicoDTO } from "@/lib/types/medico";
import type { InfoTodosPacientesDTO } from "@/lib/types/paciente";
import { validateObrigatorio, toIsoLocalDateTime } from "@/lib/form-utils";

interface ConsultaFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consulta: ConsultaDTO | null;
  medicos: MedicoDTO[];
  pacientes: InfoTodosPacientesDTO[];
  /** Quando definido, o médico é fixado (usuário logado é médico) e o select é ocultado. */
  medicoLogadoId?: string;
  onSave: (data: ConsultaPayload) => Promise<void>;
  isLoading?: boolean;
}

export function ConsultaFormModal({
  open,
  onOpenChange,
  consulta,
  medicos,
  pacientes,
  medicoLogadoId,
  onSave,
  isLoading = false,
}: ConsultaFormModalProps) {
  const isEditing = !!consulta;
  const medicoFixo = !!medicoLogadoId;

  const emptyForm = {
    idmed: "",
    idpac: "",
    dataa: "",
    observacao: "",
    prescricao: "",
    sintoma: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof emptyForm, string>>
  >({});

  useEffect(() => {
    if (consulta) {
      setFormData({
        idmed: consulta.idmedico ? String(consulta.idmedico) : "",
        idpac: consulta.idpaciente ? String(consulta.idpaciente) : "",
        dataa: consulta.dataa ?? "",
        observacao: consulta.observacao ?? "",
        prescricao: consulta.prescricao ?? "",
        sintoma: consulta.sintoma ?? "",
      });
    } else {
      setFormData({ ...emptyForm, idmed: medicoLogadoId ?? "" });
    }
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consulta, medicos, pacientes, open, medicoLogadoId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof typeof emptyForm, string>> = {
      observacao: validateObrigatorio(formData.observacao, "a observação"),
    };
    if (!isEditing) {
      newErrors.idpac = validateObrigatorio(formData.idpac, "o paciente");
      newErrors.idmed = validateObrigatorio(formData.idmed, "o médico");
      newErrors.dataa = validateObrigatorio(formData.dataa, "a data e hora");
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSave({
      ...(isEditing && consulta ? { idcon: consulta.idcon } : {}),
      medico: { idmed: parseInt(formData.idmed) },
      paciente: { idpac: parseInt(formData.idpac) },
      dataa: toIsoLocalDateTime(formData.dataa),
      observacao: formData.observacao,
      prescricao: formData.prescricao,
      sintoma: formData.sintoma,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Consulta" : "Nova Consulta"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados da consulta abaixo."
              : "Preencha os dados para agendar uma nova consulta."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4" noValidate>
          {isEditing ? (
            <div className="rounded-md border bg-muted/40 p-3 text-sm">
              <p>
                <span className="text-muted-foreground">Paciente: </span>
                {consulta?.nomepaciente}
              </p>
              <p>
                <span className="text-muted-foreground">Médico: </span>
                {consulta?.nomemedico}
              </p>
            </div>
          ) : (
            <>
              <div
                className={
                  medicoFixo
                    ? "grid gap-4"
                    : "grid grid-cols-1 gap-4 sm:grid-cols-2"
                }
              >
                <div className="grid gap-2">
                  <Label htmlFor="idpac">Paciente</Label>
                  <PacienteCombobox
                    options={pacientes.map((p, index) => ({
                      id: String(p.idpac ?? `pac-${index}`),
                      nome: p.nome_completo,
                    }))}
                    value={formData.idpac}
                    onChange={(value) => {
                      setFormData((prev) => ({ ...prev, idpac: value }));
                      setErrors((prev) => ({ ...prev, idpac: undefined }));
                    }}
                    invalid={!!errors.idpac}
                  />
                  <FieldError message={errors.idpac} />
                </div>
                {!medicoFixo && (
                  <div className="grid gap-2">
                    <Label htmlFor="idmed">Médico</Label>
                    <Select
                      value={formData.idmed}
                      onValueChange={(value) => {
                        setFormData((prev) => ({ ...prev, idmed: value }));
                        setErrors((prev) => ({ ...prev, idmed: undefined }));
                      }}
                    >
                      <SelectTrigger aria-invalid={!!errors.idmed}>
                        <SelectValue placeholder="Selecione o médico" />
                      </SelectTrigger>
                      <SelectContent>
                        {medicos.map((m) => (
                          <SelectItem key={m.idmed} value={String(m.idmed)}>
                            {m.nome_completo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError message={errors.idmed} />
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dataa">Data e Hora</Label>
                <Input
                  id="dataa"
                  name="dataa"
                  type="datetime-local"
                  value={formData.dataa}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.dataa}
                />
                <FieldError message={errors.dataa} />
              </div>
            </>
          )}

          <div className="grid gap-2">
            <Label htmlFor="sintoma">Sintoma</Label>
            <Textarea
              id="sintoma"
              name="sintoma"
              value={formData.sintoma}
              onChange={handleInputChange}
              placeholder="Descreva os sintomas do paciente"
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              name="observacao"
              value={formData.observacao}
              onChange={handleInputChange}
              placeholder="Observações da consulta"
              rows={2}
              aria-invalid={!!errors.observacao}
            />
            <FieldError message={errors.observacao} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="prescricao">Prescrição</Label>
            <Textarea
              id="prescricao"
              name="prescricao"
              value={formData.prescricao}
              onChange={handleInputChange}
              placeholder="Prescrição médica"
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : isEditing ? "Salvar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

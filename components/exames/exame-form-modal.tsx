"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldError } from "@/components/ui/field-error";
import { PacienteCombobox } from "@/components/ui/paciente-combobox";
import { validateObrigatorio , toIsoLocalDateTime} from "@/lib/form-utils";
import {
  TIPO_EXAME_LABEL,
  type ExameUnificado,
  type TipoExame,
} from "@/lib/types/exame";
import type { MedicoDTO } from "@/lib/types/medico";
import type { InfoTodosPacientesDTO } from "@/lib/types/paciente";

export interface ExameFormData {
  id?: number;
  idexame?: number;
  idmed: string;
  idpac: string;
  dataa: string;
  tipo: TipoExame;
  campos: Record<string, string>;
}

interface CampoConfig {
  name: string;
  label: string;
  placeholder: string;
}

// Campos específicos de cada tipo de exame
const CAMPOS_POR_TIPO: Record<TipoExame, CampoConfig[]> = {
  COLANGIORESSONANCIA: [
    { name: "diagnostico", label: "Diagnóstico", placeholder: "Diagnóstico do exame" },
    { name: "tecnica", label: "Técnica", placeholder: "Técnica utilizada" },
    { name: "observacao", label: "Observação", placeholder: "Observações adicionais" },
  ],
  MANOMETRIA: [
    { name: "sumario", label: "Sumário", placeholder: "Sumário do exame" },
    { name: "conclusao", label: "Conclusão", placeholder: "Conclusão do exame" },
    { name: "resultados", label: "Resultados", placeholder: "Resultados obtidos" },
  ],
  ENDOSCOPIA: [
    { name: "esofago", label: "Esôfago", placeholder: "Achados no esôfago" },
    { name: "duodeno", label: "Duodeno", placeholder: "Achados no duodeno" },
    { name: "descricao", label: "Descrição", placeholder: "Descrição do exame" },
    { name: "conclusao", label: "Conclusão", placeholder: "Conclusão do exame" },
  ],
};

interface ExameFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exame: ExameUnificado | null;
  medicos: MedicoDTO[];
  pacientes: InfoTodosPacientesDTO[];
  /** Quando definido, o médico é fixado (usuário logado é médico) e o select é ocultado. */
  medicoLogadoId?: string;
  onSave: (data: ExameFormData) => void;
  isLoading?: boolean;
}

export function ExameFormModal({
  open,
  onOpenChange,
  exame,
  medicos,
  pacientes,
  medicoLogadoId,
  onSave,
  isLoading = false,
}: ExameFormModalProps) {
  const isEdicao = !!exame;
  const medicoFixo = !!medicoLogadoId;

  const [tipo, setTipo] = useState<TipoExame>("COLANGIORESSONANCIA");
  const [idmed, setIdmed] = useState("");
  const [idpac, setIdpac] = useState("");
  const [dataa, setDataa] = useState("");
  const [campos, setCampos] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (exame) {
      setTipo(exame.tipo);
      setIdmed("");
      setIdpac("");
      setDataa(exame.dataexame ?? "");
      setCampos({ ...exame.campos });
    } else {
      setTipo("COLANGIORESSONANCIA");
      setIdmed(medicoLogadoId ?? "");
      setIdpac("");
      setDataa("");
      setCampos({});
    }
    setErrors({});
  }, [exame, open, medicoLogadoId]);

  const handleCampoChange = (name: string, value: string) => {
    setCampos((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleTipoChange = (value: TipoExame) => {
    setTipo(value);
    setCampos({});
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isEdicao) {
      const ePac = validateObrigatorio(idpac, "o paciente");
      const eMed = validateObrigatorio(idmed, "o médico");
      const eData = validateObrigatorio(dataa, "a data e hora");
      if (ePac) newErrors.idpac = ePac;
      if (eMed) newErrors.idmed = eMed;
      if (eData) newErrors.dataa = eData;
    }

    for (const campo of CAMPOS_POR_TIPO[tipo]) {
      const erro = validateObrigatorio(campos[campo.name] ?? "", `${campo.label.toLowerCase()}`);
      if (erro) newErrors[campo.name] = erro;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: exame?.id,
      idexame: exame?.idexame,
      idmed,
      idpac,
      dataa: toIsoLocalDateTime(dataa),
      tipo,
      campos,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{isEdicao ? "Editar Exame" : "Novo Exame"}</DialogTitle>
          <DialogDescription>
            {isEdicao
              ? "Atualize os dados do exame."
              : "Selecione o paciente, o médico e o tipo de exame."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2" noValidate>
          {isEdicao ? (
            <div className="rounded-md border bg-muted/40 p-3 text-sm">
              <p>
                <span className="text-muted-foreground">Paciente: </span>
                {exame?.nomepaciente}
              </p>
              <p>
                <span className="text-muted-foreground">Médico: </span>
                {exame?.nomemedico}
              </p>
              <p>
                <span className="text-muted-foreground">Tipo: </span>
                {TIPO_EXAME_LABEL[tipo]}
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
                    value={idpac}
                    onChange={(v) => {
                      setIdpac(v);
                      setErrors((prev) => ({ ...prev, idpac: "" }));
                    }}
                    invalid={!!errors.idpac}
                  />
                  <FieldError message={errors.idpac} />
                </div>
                {!medicoFixo && (
                  <div className="grid gap-2">
                    <Label htmlFor="idmed">Médico</Label>
                    <Select
                      value={idmed}
                      onValueChange={(v) => {
                        setIdmed(v);
                        setErrors((prev) => ({ ...prev, idmed: "" }));
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="dataa">Data e Hora</Label>
                  <Input
                    id="dataa"
                    type="datetime-local"
                    value={dataa}
                    onChange={(e) => {
                      setDataa(e.target.value);
                      setErrors((prev) => ({ ...prev, dataa: "" }));
                    }}
                    aria-invalid={!!errors.dataa}
                  />
                  <FieldError message={errors.dataa} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo de Exame</Label>
                  <Select
                    value={tipo}
                    onValueChange={(v) => handleTipoChange(v as TipoExame)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COLANGIORESSONANCIA">
                        Colangiorressonância
                      </SelectItem>
                      <SelectItem value="MANOMETRIA">Manometria</SelectItem>
                      <SelectItem value="ENDOSCOPIA">Endoscopia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          <div className="grid gap-4 border-t pt-4">
            {CAMPOS_POR_TIPO[tipo].map((campo) => (
              <div key={campo.name} className="grid gap-2">
                <Label htmlFor={campo.name}>{campo.label}</Label>
                <Textarea
                  id={campo.name}
                  value={campos[campo.name] ?? ""}
                  onChange={(e) => handleCampoChange(campo.name, e.target.value)}
                  placeholder={campo.placeholder}
                  rows={2}
                  aria-invalid={!!errors[campo.name]}
                />
                <FieldError message={errors[campo.name]} />
              </div>
            ))}
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
              {isLoading ? "Salvando..." : isEdicao ? "Atualizar" : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

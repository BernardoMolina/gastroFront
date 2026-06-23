"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/ui/field-error";
import { PasswordFields } from "@/components/ui/password-fields";
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
import type { InfoTodosPacientesDTO } from "@/lib/types/paciente";
import {
  maskCPF,
  maskTelefone,
  validateNome,
  validateEmail,
  validateCPF,
  validateTelefone,
  validateSenha,
  validateConfirmarSenha,
  validateObrigatorio,
} from "@/lib/form-utils";

interface PacienteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paciente?: InfoTodosPacientesDTO | null;
  onSave: (data: {
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
  }) => Promise<void>;
  isLoading?: boolean;
}

const emptyForm = {
  nome_completo: "",
  email: "",
  cpf: "",
  telefone: "",
  senha: "",
  confirmarSenha: "",
  status: "ativo",
  funcao: "",
  sangue: "",
  plano_de_saude: "",
  med_uso_cont: "",
  condicao_cronica: "",
  doenca_anterior: "",
  doenca_infec: "",
  cirurgia: "",
  data_de_nasc: "",
  alergia: "",
  historico_familiar: "",
  sexo: "",
  imunizacao: "",
};

type FormErrors = Partial<Record<keyof typeof emptyForm, string>>;

export function PacienteFormModal({
  open,
  onOpenChange,
  paciente,
  onSave,
  isLoading = false,
}: PacienteFormModalProps) {
  const isEditing = !!paciente;

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (paciente) {
      setFormData({
        nome_completo: paciente.nome_completo || "",
        email: paciente.email || "",
        cpf: paciente.cpf || "",
        telefone: paciente.telefone || "",
        senha: "",
        confirmarSenha: "",
        status: paciente.status || "ativo",
        funcao: paciente.funcao || "",
        sangue: paciente.sangue || "",
        plano_de_saude: paciente.plano_de_saude || "",
        med_uso_cont: paciente.med_uso_cont || "",
        condicao_cronica: paciente.condicao_cronica || "",
        doenca_anterior: paciente.doenca_anterior || "",
        doenca_infec: paciente.doenca_infec || "",
        cirurgia: paciente.cirurgia || "",
        data_de_nasc: paciente.data_de_nasc || "",
        alergia: paciente.alergia || "",
        historico_familiar: paciente.historico_familiar || "",
        sexo: paciente.sexo || "",
        imunizacao: paciente.imunizacao || "",
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
  }, [paciente, open]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let nextValue = value;
    if (name === "cpf") nextValue = maskCPF(value);
    if (name === "telefone") nextValue = maskTelefone(value);
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {
      nome_completo: validateNome(formData.nome_completo),
      email: validateEmail(formData.email),
      cpf: validateCPF(formData.cpf),
      telefone: validateTelefone(formData.telefone),
      senha: validateSenha(formData.senha, !isEditing),
      confirmarSenha: validateConfirmarSenha(
        formData.senha,
        formData.confirmarSenha,
        !isEditing
      ),
      data_de_nasc: validateObrigatorio(
        formData.data_de_nasc,
        "a data de nascimento"
      ),
      sexo: validateObrigatorio(formData.sexo, "o sexo"),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSave({
      ...(isEditing && paciente?.idpac ? { idpac: parseInt(paciente.idpac) } : {}),
      funcao: formData.funcao,
      sangue: formData.sangue,
      plano_de_saude: formData.plano_de_saude,
      med_uso_cont: formData.med_uso_cont,
      condicao_cronica: formData.condicao_cronica,
      doenca_anterior: formData.doenca_anterior,
      doenca_infec: formData.doenca_infec,
      cirurgia: formData.cirurgia,
      data_de_nasc: formData.data_de_nasc,
      alergia: formData.alergia,
      historico_familiar: formData.historico_familiar,
      sexo: formData.sexo,
      imunizacao: formData.imunizacao,
      usuario: {
        ...(isEditing && paciente?.iduser ? { idus: parseInt(paciente.iduser) } : {}),
        nome_completo: formData.nome_completo,
        email: formData.email,
        cpf: formData.cpf,
        telefone: formData.telefone,
        ...(formData.senha ? { senha: formData.senha } : {}),
        status: formData.status,
        permissao: "PACIENTE",
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Paciente" : "Cadastrar Paciente"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do paciente."
              : "Preencha os dados para cadastrar um novo paciente."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-6 py-4">
            {/* Dados pessoais */}
            <div className="grid gap-4">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Dados Pessoais
              </h3>
              <div className="grid gap-2">
                <Label htmlFor="nome_completo">Nome Completo</Label>
                <Input
                  id="nome_completo"
                  name="nome_completo"
                  value={formData.nome_completo}
                  onChange={handleInputChange}
                  placeholder="Maria da Silva"
                  aria-invalid={!!errors.nome_completo}
                />
                <FieldError message={errors.nome_completo} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="paciente@email.com"
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
                    value={formData.telefone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                    aria-invalid={!!errors.telefone}
                  />
                  <FieldError message={errors.telefone} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    inputMode="numeric"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    aria-invalid={!!errors.cpf}
                  />
                  <FieldError message={errors.cpf} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="data_de_nasc">Data de Nascimento</Label>
                  <Input
                    id="data_de_nasc"
                    name="data_de_nasc"
                    type="date"
                    value={formData.data_de_nasc}
                    onChange={handleInputChange}
                    aria-invalid={!!errors.data_de_nasc}
                  />
                  <FieldError message={errors.data_de_nasc} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select
                    value={formData.sexo}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, sexo: value }));
                      setErrors((prev) => ({ ...prev, sexo: undefined }));
                    }}
                  >
                    <SelectTrigger aria-invalid={!!errors.sexo}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError message={errors.sexo} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <PasswordFields
                senha={formData.senha}
                confirmarSenha={formData.confirmarSenha}
                onSenhaChange={(value) => {
                  setFormData((prev) => ({ ...prev, senha: value }));
                  setErrors((prev) => ({ ...prev, senha: undefined }));
                }}
                onConfirmarChange={(value) => {
                  setFormData((prev) => ({ ...prev, confirmarSenha: value }));
                  setErrors((prev) => ({ ...prev, confirmarSenha: undefined }));
                }}
                senhaError={errors.senha}
                confirmarError={errors.confirmarSenha}
                isEditing={isEditing}
              />
            </div>

            {/* Dados clínicos */}
            <div className="grid gap-4">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Dados Clínicos
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sangue">Tipo Sanguíneo</Label>
                  <Select
                    value={formData.sangue}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, sangue: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="plano_de_saude">Plano de Saúde</Label>
                  <Input
                    id="plano_de_saude"
                    name="plano_de_saude"
                    value={formData.plano_de_saude}
                    onChange={handleInputChange}
                    placeholder="Unimed, SUS..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="funcao">Função / Profissão</Label>
                  <Input
                    id="funcao"
                    name="funcao"
                    value={formData.funcao}
                    onChange={handleInputChange}
                    placeholder="Professor, Aposentado..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="imunizacao">Imunização</Label>
                  <Input
                    id="imunizacao"
                    name="imunizacao"
                    value={formData.imunizacao}
                    onChange={handleInputChange}
                    placeholder="Vacinas em dia..."
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="med_uso_cont">Medicamentos de Uso Contínuo</Label>
                <Textarea
                  id="med_uso_cont"
                  name="med_uso_cont"
                  value={formData.med_uso_cont}
                  onChange={handleInputChange}
                  placeholder="Liste os medicamentos..."
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alergia">Alergias</Label>
                <Textarea
                  id="alergia"
                  name="alergia"
                  value={formData.alergia}
                  onChange={handleInputChange}
                  placeholder="Liste as alergias..."
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="condicao_cronica">Condições Crônicas</Label>
                <Textarea
                  id="condicao_cronica"
                  name="condicao_cronica"
                  value={formData.condicao_cronica}
                  onChange={handleInputChange}
                  placeholder="Diabetes, hipertensão..."
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="doenca_anterior">Doenças Anteriores</Label>
                <Textarea
                  id="doenca_anterior"
                  name="doenca_anterior"
                  value={formData.doenca_anterior}
                  onChange={handleInputChange}
                  placeholder="Histórico de doenças..."
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="doenca_infec">Doenças Infecciosas</Label>
                <Textarea
                  id="doenca_infec"
                  name="doenca_infec"
                  value={formData.doenca_infec}
                  onChange={handleInputChange}
                  placeholder="Histórico de doenças infecciosas..."
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cirurgia">Cirurgias</Label>
                <Textarea
                  id="cirurgia"
                  name="cirurgia"
                  value={formData.cirurgia}
                  onChange={handleInputChange}
                  placeholder="Cirurgias realizadas..."
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="historico_familiar">Histórico Familiar</Label>
                <Textarea
                  id="historico_familiar"
                  name="historico_familiar"
                  value={formData.historico_familiar}
                  onChange={handleInputChange}
                  placeholder="Doenças na família..."
                  rows={2}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : isEditing ? "Atualizar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

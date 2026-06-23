"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { UsuarioDTO } from "@/lib/types/secretaria";
import {
  maskCPF,
  maskTelefone,
  validateNome,
  validateEmail,
  validateCPF,
  validateTelefone,
  validateSenha,
  validateConfirmarSenha,
} from "@/lib/form-utils";

interface SecretariaFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  secretaria?: UsuarioDTO | null;
  onSave: (data: {
    idus?: number;
    nome_completo: string;
    email: string;
    cpf: string;
    telefone: string;
    senha?: string;
    permissao: string;
    status: string;
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
};

type FormErrors = Partial<Record<keyof typeof emptyForm, string>>;

export function SecretariaFormModal({
  open,
  onOpenChange,
  secretaria,
  onSave,
  isLoading = false,
}: SecretariaFormModalProps) {
  const isEditing = !!secretaria;

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (secretaria) {
      setFormData({
        nome_completo: secretaria.nome_completo || "",
        email: secretaria.email || "",
        cpf: secretaria.cpf || "",
        telefone: secretaria.telefone || "",
        senha: "",
        confirmarSenha: "",
        status: secretaria.status || "ativo",
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
  }, [secretaria, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSave({
      ...(isEditing && secretaria?.idus ? { idus: secretaria.idus } : {}),
      nome_completo: formData.nome_completo,
      email: formData.email,
      cpf: formData.cpf,
      telefone: formData.telefone,
      ...(formData.senha ? { senha: formData.senha } : {}),
      permissao: "SECRETARIA",
      status: formData.status,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Secretária" : "Cadastrar Secretária"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações da secretária."
              : "Preencha os dados para cadastrar uma nova secretária."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-4 py-4">
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
                  placeholder="secretaria@email.com"
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

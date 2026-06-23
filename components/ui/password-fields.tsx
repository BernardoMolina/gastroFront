"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";

interface PasswordFieldsProps {
  senha: string;
  confirmarSenha: string;
  onSenhaChange: (value: string) => void;
  onConfirmarChange: (value: string) => void;
  senhaError?: string;
  confirmarError?: string;
  /** Quando true, mostra rótulos de "Nova Senha" para edição. */
  isEditing?: boolean;
}

export function PasswordFields({
  senha,
  confirmarSenha,
  onSenhaChange,
  onConfirmarChange,
  senhaError,
  confirmarError,
  isEditing = false,
}: PasswordFieldsProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="senha">
          {isEditing ? "Nova Senha (opcional)" : "Senha"}
        </Label>
        <div className="relative">
          <Input
            id="senha"
            name="senha"
            type={show ? "text" : "password"}
            value={senha}
            onChange={(e) => onSenhaChange(e.target.value)}
            placeholder="••••••••"
            className="pr-10"
            aria-invalid={!!senhaError}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
            aria-label={show ? "Ocultar senha" : "Mostrar senha"}
          >
            {show ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <FieldError message={senhaError} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
        <div className="relative">
          <Input
            id="confirmarSenha"
            name="confirmarSenha"
            type={show ? "text" : "password"}
            value={confirmarSenha}
            onChange={(e) => onConfirmarChange(e.target.value)}
            placeholder="••••••••"
            className="pr-10"
            aria-invalid={!!confirmarError}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
            aria-label={show ? "Ocultar senha" : "Mostrar senha"}
          >
            {show ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <FieldError message={confirmarError} />
      </div>
    </div>
  );
}

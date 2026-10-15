"use client";

import { toast as sonnerToast } from "sonner";
import type { ReactNode } from "react";

type ToastOptions = {
  title?: ReactNode;
  description?: ReactNode;
  variant?: "default" | "destructive";
};

function toast({ title, description, variant }: ToastOptions) {
  const showToast = variant === "destructive" ? sonnerToast.error : sonnerToast;
  return showToast(title ?? "", { description });
}

function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}

export { useToast, toast };
"use client";

import { AUTH_MODAL_CLASS } from "@/components/auth/auth-modal-classes";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Modal } from "@/components/ui/Modal";

type SignUpModalProps = {
  open: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
};

export function SignUpModal({ open, onClose, onLoginClick }: SignUpModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Sign up" className={AUTH_MODAL_CLASS}>
      <SignUpForm
        onLoginClick={() => {
          onClose();
          onLoginClick?.();
        }}
      />
    </Modal>
  );
}

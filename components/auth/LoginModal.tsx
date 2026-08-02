"use client";

import { AUTH_MODAL_CLASS } from "@/components/auth/auth-modal-classes";
import { LoginForm } from "@/components/auth/LoginForm";
import { Modal } from "@/components/ui/Modal";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  onSignUpClick?: () => void;
  onSuccess?: () => void;
};

export function LoginModal({
  open,
  onClose,
  onSignUpClick,
  onSuccess,
}: LoginModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log in"
      className={AUTH_MODAL_CLASS}
    >
      <LoginForm
        onSuccess={onSuccess}
        onSignUpClick={() => {
          onClose();
          onSignUpClick?.();
        }}
      />
    </Modal>
  );
}

// Ui components
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

// Components
import Button from "./form/Button";

const ConfirmationModalContent = ({
  isOpen = false,
  isLoading = false,
  onClose = () => {},
  onSubmit = () => {},
  variant = "primary",
  actionLabel = "Tasdiqlash",
  title = "Amalni tasdiqlang",
  cancelLabel = "Bekor qilish",
  description = "Haqiqatdan ham ushbu amalani bajarmoqchimisiz?",
}) => {
  const handleAction = () => {
    if (!isLoading) onSubmit();
  };

  return (
    <Dialog open={!!isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="flex justify-end gap-5 w-full">
          <Button
            type="button"
            className="w-32"
            variant="neutral"
            onClick={onClose}
          >
            {cancelLabel}
          </Button>

          <Button
            autoFocus
            className="w-32"
            variant={variant}
            disabled={isLoading}
            onClick={handleAction}
          >
            {actionLabel}
            {isLoading && "..."}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModalContent;

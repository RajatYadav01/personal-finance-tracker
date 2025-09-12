import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import {
  categoryFormSchema,
  type CategoryFormData,
  type Category,
} from "../types/category.types";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCategory: (data: CategoryFormData) => void;
  initialData?: Category | null;
}

export const CategoryModal = ({
  isOpen,
  onClose,
  onSubmitCategory,
  initialData,
}: CategoryModalProps) => {
  const defaultValues: CategoryFormData | undefined = initialData
    ? {
        name: initialData.name,
        color: initialData.color,
      }
    : undefined;
  const {
    register: registerCategory,
    handleSubmit: handleSubmitCategory,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? "Edit category" : "Create new category"}
    >
      <form
        onSubmit={handleSubmitCategory(onSubmitCategory)}
        className="space-y-4"
      >
        <Input
          label="Category name"
          {...registerCategory("name", { required: true })}
          error={errors.name?.message}
          required
        />
        <Input
          label="Category color"
          type="color"
          {...registerCategory("color", { required: true })}
          className="w-12 h-12 cursor-pointer"
          error={errors.color?.message}
          required
        />
        <div className="flex justify-end">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
};

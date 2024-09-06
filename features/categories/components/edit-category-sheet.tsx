import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { CategoryForm } from "./category-form";
import { insertCategorySchema } from "@/db/schema";
import { z } from "zod";
import { useOpenCategory } from "../hooks/use-open-category";
import { useGetCategory } from "../api/use-get-category";
import { Loader2 } from "lucide-react";
import { useEditCategory } from "../api/use-edit-category";
import { useConfirm } from "@/hooks/use-confirm";
import {useDeleteCategory} from "../api/use-delete-category";

export const EditCategorySheet = () => {

  const {isOpen, onClose, id} = useOpenCategory();
  const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "You are about to delete this category");
  const categoryQuery = useGetCategory(id);
  const editMutation = useEditCategory(id);
  const deleteMutation = useDeleteCategory(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = categoryQuery.isLoading;

  const formSchema = insertCategorySchema.pick({name: true});

  type FormValues = z.input<typeof formSchema>;

  const onDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        }
      });
    }
  };

  const onSubmit = (values: FormValues) => {
   editMutation.mutate(values, {
    onSuccess: () => 
      {
        onClose();
      }});
  }

  const defaultValues = categoryQuery.data ? {
    name: categoryQuery.data.name
  } : {
    name:"",
  };



  return (
    <>
      <ConfirmDialog/>
      <Sheet open={isOpen} onOpenChange={onClose}>
        
          <SheetContent className="space-y-4">
            <SheetHeader>
              <SheetTitle>
                Edit Category
              </SheetTitle>
              <SheetDescription>
                Change an existing category.
              </SheetDescription>
            </SheetHeader>
            { isLoading ? (
              <div className="absolue inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin"/>
              </div>

            ): 
            ( <CategoryForm id={id} onSubmit={onSubmit} defaultValues={defaultValues}  disabled={isPending} onDelete={onDelete}/>)
          }
          </SheetContent> 
      </Sheet>
    </>
  )
}

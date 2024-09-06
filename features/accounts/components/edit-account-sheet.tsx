import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { AccountForm } from "./account-form";
import { insertAccountSchema } from "@/db/schema";
import { z } from "zod";
import { useOpenAccount } from "../hooks/use-open-account";
import { useGetAccount } from "../api/use-get-account";
import { Loader2 } from "lucide-react";
import { useEditAccount } from "../api/use-edit-account";
import { useDeleteAccount } from "../api/use-delete-account";
import { useConfirm } from "@/hooks/use-confirm";

export const EditAccountSheet = () => {

  const {isOpen, onClose, id} = useOpenAccount();
  const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "You are about to delete this transaction");
  const accountQuery = useGetAccount(id);
  const editMutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = accountQuery.isLoading;

  const formSchema = insertAccountSchema.pick({name: true});

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

  const defaultValues = accountQuery.data ? {
    name: accountQuery.data.name
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
                Edit Account
              </SheetTitle>
              <SheetDescription>
                Change an existing account.
              </SheetDescription>
            </SheetHeader>
            { isLoading ? (
              <div className="absolue inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin"/>
              </div>

            ): 
            ( <AccountForm id={id} onSubmit={onSubmit} defaultValues={defaultValues}  disabled={isPending} onDelete={onDelete}/>)
          }
          </SheetContent> 
      </Sheet>
    </>
  )
}

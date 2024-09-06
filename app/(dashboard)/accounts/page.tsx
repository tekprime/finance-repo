"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete";
export default function AccountsPage() {

  const newAccount = useNewAccount();
  const accountsQuery = useGetAccounts();
  const deleteAccounts = useBulkDeleteAccounts();
  const accounts = accountsQuery.data || [];

  const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending;
  

  if (accountsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full -mt-24 pb-10">
        <Card className="border-none drop-shadow-md">
           <CardHeader>
             <Skeleton className="h-8 w-48"/>
           </CardHeader>
           <CardContent>
             <div className="h-[500px] w-full flex items-center justify-center">
                <Loader2 className="size-6 animate-spin text-slate-300"/>
             </div>
           </CardContent>
        </Card>
      </div>
    )
  };
  return (
    <div className="max-w-screen-2xl mx-auto w-full -mt-24 pb-10">
      <Card className="border-none drop-shadow-md">
        <CardHeader className="gap-y-2 lg:flex-row lg:justify-between lg:items-center">
          <CardTitle className="text-xl line-clamp-1">
            Accounts Page
          </CardTitle>
          <Button onClick={newAccount.onOpen} size="sm">
            <Plus className="size-4 mr-2"/>
             Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable onDelete={(row) => {
            const ids = row.map((r) => r.original.id);
            deleteAccounts.mutate({ids});
          }} filterKey="email" columns={columns} data={accounts} disabled={isDisabled} />
        </CardContent>
      </Card>
    </div>
  )
}
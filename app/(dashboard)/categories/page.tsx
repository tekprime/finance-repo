"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete-categories";

export default function CategoriesPage() {

  const newCategory = useNewCategory();
  const categoriesQuery = useGetCategories();
  const deleteCategories = useBulkDeleteCategories();
  const categories = categoriesQuery.data || [];

  const isDisabled = categoriesQuery.isLoading || deleteCategories.isPending;
  

  if (categoriesQuery.isLoading) {
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
            Categories Page
          </CardTitle>
          <Button onClick={newCategory.onOpen} size="sm">
            <Plus className="size-4 mr-2"/>
             Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable onDelete={(row) => {
            const ids = row.map((r) => r.original.id);
            deleteCategories.mutate({ids});
          }} filterKey="name" columns={columns} data={categories} disabled={isDisabled} />
        </CardContent>
      </Card>
    </div>
  )
}

"use client";

import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { Button } from "@/components/ui/button";
export default function Home() {
  const {onOpen} = useNewAccount();
  return (
  <div>
    <Button onClick={onOpen}>
      Add Account
    </Button>
  </div>
  );
}

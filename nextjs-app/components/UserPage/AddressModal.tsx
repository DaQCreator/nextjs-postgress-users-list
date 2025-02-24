"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddressForm, { AddressFormValues } from "../forms/AddressForm";

type AddressModalProps = {
  userId: number;
  mode: "create" | "edit";
  defaultValues?: Partial<AddressFormValues>;
  oldAddressType?: string;
  oldValidFrom?: string;
};

export function AddressModal({
  userId,
  mode,
  defaultValues,
  oldAddressType,
  oldValidFrom,
}: AddressModalProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          {mode === "create" ? "Create Address" : "Edit"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Address" : "Edit Address"}
          </DialogTitle>
          <DialogDescription>
            Fill out the form below to {mode} an address.
          </DialogDescription>
        </DialogHeader>

        <AddressForm
          userId={userId}
          mode={mode}
          oldAddressType={oldAddressType}
          oldValidFrom={oldValidFrom}
          defaultValues={defaultValues}
          onSuccess={() => {
            setOpen(false);
          }}
        />

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createAddressAction,
  editAddressAction,
} from "@/actions/users/address/action";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const addressSchema = z.object({
  userId: z.number(),
  addressType: z.enum(["HOME", "INVOICE", "POST", "WORK"]),
  validFrom: z.string().min(1, "Valid from is required"),
  postCode: z.string().min(1, "Post code is required"),
  city: z.string().min(1, "City is required"),
  countryCode: z
    .string()
    .length(3, "Country code must be exactly 3 letters")
    .transform((val) => val.toUpperCase()),
  street: z.string().min(1, "Street is required"),
  buildingNumber: z.string().min(1, "Building number is required"),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

type AddressFormProps = {
  userId: number;
  mode: "create" | "edit";
  oldAddressType?: string;
  oldValidFrom?: string;
  defaultValues?: Partial<AddressFormValues>;
  onSuccess?: () => void;
};

export default function AddressForm({
  userId,
  mode,
  oldAddressType,
  oldValidFrom,
  defaultValues,
  onSuccess,
}: AddressFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
    control,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      userId,
      addressType: defaultValues?.addressType ?? "HOME",
      validFrom: defaultValues?.validFrom
        ? new Date(defaultValues.validFrom).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
      postCode: defaultValues?.postCode ?? "",
      city: defaultValues?.city ?? "",
      countryCode: defaultValues?.countryCode ?? "USA",
      street: defaultValues?.street ?? "",
      buildingNumber: defaultValues?.buildingNumber ?? "",
    },
  });

  const street = watch("street");
  const buildingNumber = watch("buildingNumber");
  const postCode = watch("postCode");
  const city = watch("city");
  const countryCode = watch("countryCode");

  const onSubmit = async (values: AddressFormValues) => {
    try {
      if (mode === "create") {
        await createAddressAction({
          userId: values.userId,
          addressType: values.addressType,
          validFrom: values.validFrom,
          postCode: values.postCode,
          city: values.city,
          countryCode: values.countryCode,
          street: values.street,
          buildingNumber: values.buildingNumber,
        });
      } else {
        await editAddressAction({
          userId: values.userId,
          oldAddressType: oldAddressType!,
          oldValidFrom: oldValidFrom!,
          addressType: values.addressType,
          validFrom: values.validFrom,
          postCode: values.postCode,
          city: values.city,
          countryCode: values.countryCode,
          street: values.street,
          buildingNumber: values.buildingNumber,
        });
      }
      onSuccess?.();
      router.refresh();
    } catch (err: any) {
      setError("root", { message: err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col space-y-1">
        <Label htmlFor="addressType">Address Type</Label>

        <Controller
          control={control}
          name="addressType"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                id="addressType"
                className="rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm"
              >
                <SelectValue placeholder="Select address type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOME">HOME</SelectItem>
                <SelectItem value="INVOICE">INVOICE</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="WORK">WORK</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {errors.addressType && (
          <p className="text-red-500 text-sm">{errors.addressType.message}</p>
        )}
      </div>

      {/* validFrom */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="validFrom">Valid From</Label>
        <Input
          id="validFrom"
          type="datetime-local"
          {...register("validFrom")}
        />
        {errors.validFrom && (
          <p className="text-red-500 text-sm">{errors.validFrom.message}</p>
        )}
      </div>

      {/* postCode */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="postCode">Post Code</Label>
        <Input id="postCode" {...register("postCode")} />
        {errors.postCode && (
          <p className="text-red-500 text-sm">{errors.postCode.message}</p>
        )}
      </div>

      {/* city */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="city">City</Label>
        <Input id="city" {...register("city")} />
        {errors.city && (
          <p className="text-red-500 text-sm">{errors.city.message}</p>
        )}
      </div>

      {/* countryCode */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="countryCode">Country Code</Label>
        <Input id="countryCode" {...register("countryCode")} />
        {errors.countryCode && (
          <p className="text-red-500 text-sm">{errors.countryCode.message}</p>
        )}
      </div>

      {/* street */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="street">Street</Label>
        <Input id="street" {...register("street")} />
        {errors.street && (
          <p className="text-red-500 text-sm">{errors.street.message}</p>
        )}
      </div>

      {/* buildingNumber */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="buildingNumber">Building Number</Label>
        <Input id="buildingNumber" {...register("buildingNumber")} />
        {errors.buildingNumber && (
          <p className="text-red-500 text-sm">
            {errors.buildingNumber.message}
          </p>
        )}
      </div>

      <div className="bg-gray-100 p-2 rounded text-sm text-gray-800 whitespace-pre-line">
        {street} {buildingNumber}
        <br />
        {postCode} {city}
        <br />
        {countryCode.toUpperCase()}
      </div>

      {/* Submit */}
      <div className="flex justify-end space-x-2 mt-4">
        <Button type="submit">{mode === "create" ? "Create" : "Update"}</Button>
      </div>

      {errors.root?.message && (
        <p className="text-red-500 text-sm mt-2">{errors.root.message}</p>
      )}
    </form>
  );
}

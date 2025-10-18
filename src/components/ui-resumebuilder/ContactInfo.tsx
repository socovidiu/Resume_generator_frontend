import React, { useEffect } from "react";

import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
  Control,
  useFieldArray,
  UseFormSetValue,
} from "react-hook-form";
import { CVData } from "../../types/CVtype";
import { Field, Input, Textarea, Select } from "../ui-elements/Form"; 


interface ContactInfoProps {
  register: UseFormRegister<CVData>;
  errors: FieldErrors<CVData>;
  handleSubmit: UseFormHandleSubmit<CVData>;
  control: Control<CVData>;                 // 👈 NEW: pass control from parent useForm
  setValue: UseFormSetValue<CVData>;        // 👈 NEW: to keep photo in form data
  onSubmit: (cvData: CVData) => void;
  photo: string | null;
  setPhoto: (photo: string | null) => void;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  register,
  errors,
  handleSubmit,
  control,
  setValue,
  onSubmit,
  photo,
  setPhoto,
}) => {
  // RHF-managed links array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  // Ensure at least one link row exists (optional)
  useEffect(() => {
    if (fields.length === 0) {
      append({ type: "LinkedIn", url: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep "photo" in the form state so it is included in payload
  useEffect(() => {
    const clean = photo && photo.trim() !== "" ? photo : null;
    setValue("photo", clean, { shouldValidate: false, shouldDirty: true });
}, [photo, setValue]);

  // Handle file selection for photo (keeps your preview approach)
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="form-shell"
    >
      
      {/* ---------- Header ---------- */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
        <p className="text-sm text-gray-600">Tell us who you are and how to reach you.</p>
      </div>

      {/* Photo Upload */}
      <div className="flex flex-col items-center mt-6">
        <label htmlFor="photo-upload" className="cursor-pointer">
          {photo ? (
            <img
              src={photo}
              alt="Uploaded"
              className="w-24 h-24 rounded-full object-cover border border-gray-400"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-4xl">
              👤
            </div>
          )}
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoUpload}
        />
      </div>

      {/* ---------- Basic Info ---------- */}
      <div className="form-grid">
        <Field
          label="First name"
          htmlFor="firstName"
          error={errors.firstName?.message as string | undefined}
        >
          <Input
            id="firstName"
            placeholder="Ada"
            autoComplete="given-name"
            {...register("firstName", { required: "First name is required" })}
          />
        </Field>

        <Field
          label="Last name"
          htmlFor="lastName"
          error={errors.lastName?.message as string | undefined}
        >
          <Input
            id="lastName"
            placeholder="Lovelace"
            autoComplete="family-name"
            {...register("lastName", { required: "Last name is required" })}
          />
        </Field>

        <Field
          label="City"
          htmlFor="city"
          error={errors.city?.message as string | undefined}
        >
          <Input id="city" placeholder="London" {...register("city")} />
        </Field>

        <Field
          label="Country"
          htmlFor="country"
          error={errors.country?.message as string | undefined}
        >
          <Input id="country" placeholder="United Kingdom" {...register("country")} />
        </Field>

        <Field
          label="Postal Code"
          htmlFor="postalCode"
          error={errors.postcode?.message as string | undefined}
        >
          <Input id="postalCode" placeholder="E1 6AN" {...register("postcode")} />
        </Field>

        <Field
          label="Phone"
          htmlFor="phone"
          error={errors.phone?.message as string | undefined}
        >
          <Input
            id="phone"
            type="tel"
            placeholder="+44 7123 456789"
            autoComplete="tel"
            {...register("phone")}
          />
        </Field>

        <Field
          label="Email"
          htmlFor="email"
          error={errors.email?.message as string | undefined}
          hint="We’ll never share your email."
        >
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email address",
              },
            })}
          />
        </Field>
      </div>
      
      {/* Links (RHF-managed) */}
      <div className="form-section">
        <label className="block text-sm font-medium text-gray-800">Links</label>

        {fields.map((field, index) => {
          // helpful dynamic id bases for a11y
          const typeId = `links.${index}.type`;
          const urlId = `links.${index}.url`;
          const urlError = (errors as any)?.links?.[index]?.url?.message as string | undefined;

          return (
            <div
              key={field.id}
              className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 md:p-5"
            >
              <div className="flex gap-3 items-start">
                {/* Type select */}
                <div className="w-30 shrink-0">
                  <Field label="Type" htmlFor={typeId}>
                    <Select
                      id={typeId}
                      defaultValue={(field as any).type ?? "LinkedIn"}
                      {...register(`links.${index}.type` as const)}
                    >
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="GitHub">GitHub</option>
                      <option value="Website">Website</option>
                    </Select>
                  </Field>
                </div>

                {/* URL input with validation + error */}
                <div className="flex-1">
                  <Field
                    label="URL"
                    htmlFor={urlId}
                    error={urlError}
                    hint="Use a full URL starting with http:// or https://"
                  >
                    <Input
                      id={urlId}
                      type="url"
                      placeholder={
                        ((field as any).type ?? "LinkedIn") === "GitHub"
                          ? "https://github.com/username"
                          : ((field as any).type ?? "LinkedIn") === "Website"
                          ? "https://yourdomain.com"
                          : "https://linkedin.com/in/username"
                      }
                      defaultValue={(field as any).url ?? ""}
                      {...register(`links.${index}.url` as const, {
                        pattern: {
                          value: /^https?:\/\//i,
                          message: "URL should start with http:// or https://",
                        },
                      })}
                    />
                  </Field>
                </div>

                {/* Remove button */}
                <div className="pt-7">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-sm text-gray-600 hover:text-red-600 hover:underline"
                    aria-label={`Remove link ${index + 1}`}
                    title="Remove link"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => append({ type: "LinkedIn", url: "" })}
          className="text-sm font-medium text-blue-700 hover:text-blue-800 hover:underline"
        >
          + Add another link
        </button>
      </div>

    </form>
  );
};

export default ContactInfo;

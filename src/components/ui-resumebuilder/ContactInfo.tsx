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
    setValue("photo", photo ?? null, { shouldValidate: false, shouldDirty: true });
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
      className="flex flex-col items-center bg-gray-100 text-black p-6 rounded-lg shadow-md w-full"
    >
      <h2 className="text-2xl font-bold mb-4">Contact Info</h2>

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

      {/* Grid Layout for Inputs */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {/* First Name */}
        <div>
          <label className="block text-xs font-semibold">FIRST NAME</label>
          <input
            {...register("firstName", { required: "First name is required" })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="First Name"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-xs font-semibold">LAST NAME</label>
          <input
            {...register("lastName", { required: "Last name is required" })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Last Name"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs">{errors.lastName.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-semibold">CITY</label>
          <input
            {...register("city", { required: "City is required" })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="City"
          />
          {errors.city && (
            <p className="text-red-500 text-xs">{errors.city.message}</p>
          )}
        </div>

        {/* County (country field) */}
        <div>
          <label className="block text-xs font-semibold">COUNTY</label>
          <input
            {...register("country", { required: "County is required" })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="County"
          />
          {errors.country && (
            <p className="text-red-500 text-xs">{errors.country.message}</p>
          )}
        </div>

        {/* Postcode */}
        <div>
          <label className="block text-xs font-semibold">POSTCODE</label>
          <input
            {...register("postcode", {
              required: "Postcode is required",
              pattern: {
                value: /^[A-Za-z0-9 ]{3,10}$/,
                message: "Invalid postcode format",
              },
            })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Postcode"
          />
          {errors.postcode && (
            <p className="text-red-500 text-xs">{errors.postcode.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold">PHONE</label>
          <input
            {...register("phone", {
              required: "Phone number is required",
              pattern: { value: /^[0-9]{10,15}$/, message: "Invalid phone number" },
            })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Phone"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="col-span-2">
          <label className="block text-xs font-semibold">EMAIL</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Invalid email format",
              },
            })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* Links (RHF-managed) */}
        <div className="col-span-2 space-y-4">
          <label className="block text-xs font-semibold">LINKS</label>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <select
                className="w-1/3 border rounded-md p-2"
                defaultValue={field.type ?? "LinkedIn"}
                {...register(`links.${index}.type` as const)}
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="GitHub">GitHub</option>
                <option value="Website">Website</option>
              </select>

              <input
                type="url"
                placeholder="https://..."
                className="w-2/3 border rounded-md p-2"
                defaultValue={field.url ?? ""}
                {...register(`links.${index}.url` as const, {
                  pattern: {
                    value: /^https?:\/\//i,
                    message: "URL should start with http:// or https://",
                  },
                })}
              />

              <button
                type="button"
                onClick={() => remove(index)}
                className="text-sm px-2"
                aria-label="Remove link"
                title="Remove link"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ type: "LinkedIn", url: "" })}
            className="mt-2 text-blue-500 hover:underline text-sm"
          >
            + Add another link
          </button>
        </div>
      </div>

      {/* Submit lives outside the grid so it’s at the bottom */}
      <div className="mt-6 w-full">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Save & Continue
        </button>
      </div>
    </form>
  );
};

export default ContactInfo;

import React from "react";
import FormField from "./fields/FormField";

export type ProfileValues = {
  firstName: string; lastName: string; headline: string; location: string;
  website?: string; linkedIn?: string; github?: string;
};

export default function ProfileForm({
  values, onChange, onSubmit, saving,
}: {
  values: ProfileValues;
  onChange: (patch: Partial<ProfileValues>) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving?: boolean;
}) {
  const v = values;
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField id="first" label="First name" value={v.firstName} onChange={(e)=>onChange({ firstName: e.currentTarget.value })} />
      <FormField id="last" label="Last name" value={v.lastName} onChange={(e)=>onChange({ lastName: e.currentTarget.value })} />
      <div className="sm:col-span-2">
        <FormField id="headline" label="Headline" value={v.headline} onChange={(e)=>onChange({ headline: e.currentTarget.value })} />
      </div>
      <div className="sm:col-span-2">
        <FormField id="location" label="Location" value={v.location} onChange={(e)=>onChange({ location: e.currentTarget.value })} />
      </div>

      <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField id="website"  label="Website"  value={v.website ?? ""}  onChange={(e)=>onChange({ website: e.currentTarget.value })} />
        <FormField id="linkedin" label="LinkedIn" value={v.linkedIn ?? ""} onChange={(e)=>onChange({ linkedIn: e.currentTarget.value })} />
        <FormField id="github"   label="GitHub"   value={v.github ?? ""}   onChange={(e)=>onChange({ github: e.currentTarget.value })} />
      </div>

      <div className="sm:col-span-2">
        <button type="submit" disabled={!!saving} className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white disabled:opacity-60 hover:bg-indigo-700">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
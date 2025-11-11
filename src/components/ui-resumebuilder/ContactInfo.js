import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useFieldArray, } from "react-hook-form";
import { Field, Input, Select } from "../ui-elements/Form";
const ContactInfo = ({ register, errors, handleSubmit, control, setValue, onSubmit, photo, setPhoto, }) => {
    // RHF-managed links array (fully typed)
    const { fields, append, remove } = useFieldArray({
        control,
        name: "links",
    });
    // Ensure at least one link row exists (optional)
    useEffect(() => {
        if (fields.length === 0) {
            const first = { type: "LinkedIn", url: "" };
            append(first);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // Keep "photo" in the form state so it is included in payload
    useEffect(() => {
        const clean = photo && photo.trim() !== "" ? photo : null;
        setValue("photo", clean, { shouldValidate: false, shouldDirty: true });
    }, [photo, setValue]);
    // Handle file selection for photo (keeps your preview approach)
    const handlePhotoUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onloadend = () => setPhoto(reader.result);
        reader.readAsDataURL(file);
    };
    return (_jsxs("form", { onSubmit: handleSubmit((data) => onSubmit(data)), className: "form-shell", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Contact Information" }), _jsx("p", { className: "text-sm text-gray-600", children: "Tell us who you are and how to reach you." })] }), _jsxs("div", { className: "flex flex-col items-center mt-6", children: [_jsx("label", { htmlFor: "photo-upload", className: "cursor-pointer", children: photo ? (_jsx("img", { src: photo, alt: "Uploaded", className: "w-24 h-24 rounded-full object-cover border border-gray-400" })) : (_jsx("div", { className: "w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-4xl", children: "\uD83D\uDC64" })) }), _jsx("input", { id: "photo-upload", type: "file", accept: "image/*", className: "hidden", onChange: handlePhotoUpload })] }), _jsxs("div", { className: "form-grid", children: [_jsx(Field, { label: "First name", htmlFor: "firstName", error: errors.firstName?.message, children: _jsx(Input, { id: "firstName", placeholder: "Ada", autoComplete: "given-name", ...register("firstName", { required: "First name is required" }) }) }), _jsx(Field, { label: "Last name", htmlFor: "lastName", error: errors.lastName?.message, children: _jsx(Input, { id: "lastName", placeholder: "Lovelace", autoComplete: "family-name", ...register("lastName", { required: "Last name is required" }) }) }), _jsx(Field, { label: "City", htmlFor: "city", error: errors.city?.message, children: _jsx(Input, { id: "city", placeholder: "London", ...register("city") }) }), _jsx(Field, { label: "Country", htmlFor: "country", error: errors.country?.message, children: _jsx(Input, { id: "country", placeholder: "United Kingdom", ...register("country") }) }), _jsx(Field, { label: "Postal Code", htmlFor: "postalCode", error: errors.postcode?.message, children: _jsx(Input, { id: "postalCode", placeholder: "E1 6AN", ...register("postcode") }) }), _jsx(Field, { label: "Phone", htmlFor: "phone", error: errors.phone?.message, children: _jsx(Input, { id: "phone", type: "tel", placeholder: "+44 7123 456789", autoComplete: "tel", ...register("phone") }) }), _jsx(Field, { label: "Email", htmlFor: "email", error: errors.email?.message, hint: "We\u2019ll never share your email.", children: _jsx(Input, { id: "email", type: "email", placeholder: "you@example.com", autoComplete: "email", ...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: "Enter a valid email address",
                                },
                            }) }) })] }), _jsxs("div", { className: "form-section", children: [_jsx("label", { className: "block text-sm font-medium text-gray-800", children: "Links" }), fields.map((field, index) => {
                        const typeId = `links.${index}.type`;
                        const urlId = `links.${index}.url`;
                        const linkType = field.type ?? "LinkedIn";
                        const urlError = errors.links?.[index]?.url?.message;
                        return (_jsx("div", { className: "rounded-xl border border-gray-200 bg-white shadow-sm p-4 md:p-5", children: _jsxs("div", { className: "flex gap-3 items-start", children: [_jsx("div", { className: "w-30 shrink-0", children: _jsx(Field, { label: "Type", htmlFor: typeId, children: _jsxs(Select, { id: typeId, defaultValue: linkType, ...register(`links.${index}.type`), children: [_jsx("option", { value: "LinkedIn", children: "LinkedIn" }), _jsx("option", { value: "GitHub", children: "GitHub" }), _jsx("option", { value: "Website", children: "Website" })] }) }) }), _jsx("div", { className: "flex-1", children: _jsx(Field, { label: "URL", htmlFor: urlId, error: urlError, hint: "Use a full URL starting with http:// or https://", children: _jsx(Input, { id: urlId, type: "url", placeholder: linkType === "GitHub"
                                                    ? "https://github.com/username"
                                                    : linkType === "Website"
                                                        ? "https://yourdomain.com"
                                                        : "https://linkedin.com/in/username", defaultValue: field.url ?? "", ...register(`links.${index}.url`, {
                                                    pattern: {
                                                        value: /^https?:\/\//i,
                                                        message: "URL should start with http:// or https://",
                                                    },
                                                }) }) }) }), _jsx("div", { className: "pt-7", children: _jsx("button", { type: "button", onClick: () => remove(index), className: "text-sm text-gray-600 hover:text-red-600 hover:underline", "aria-label": `Remove link ${index + 1}`, title: "Remove link", children: "Remove" }) })] }) }, field.id));
                    }), _jsx("button", { type: "button", onClick: () => append({ type: "LinkedIn", url: "" }), className: "text-sm font-medium text-blue-700 hover:text-blue-800 hover:underline", children: "+ Add another link" })] })] }));
};
export default ContactInfo;

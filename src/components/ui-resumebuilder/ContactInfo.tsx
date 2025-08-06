import React, { useEffect, useState } from "react";
import { UseFormRegister, FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import { CVData, LinkItem} from "../../types/CVtype";

interface ContactInfoProps {
    register: UseFormRegister<CVData>;
    errors: FieldErrors<CVData>;
    handleSubmit: UseFormHandleSubmit<CVData>;
    onSubmit: (cvData: CVData) => void;
    photo: string | null;
    setPhoto: (photo: string | null) => void; 
}



const ContactInfo: React.FC<ContactInfoProps> = ({ register, errors, handleSubmit, onSubmit, photo, setPhoto }) => {

    // Add links for the contact
    const [links, setLinks] = useState<LinkItem[]>([
        { type: "LinkedIn", url: "" }
    ]);

    const handleLinkChange = (index: number, field: keyof LinkItem, value: string) => {
        const updatedLinks = [...links];
        updatedLinks[index][field] = value as any;
        setLinks(updatedLinks);
    };
    // Add new link
    const addNewLink = () => {
        setLinks([...links, { type: "LinkedIn", url: "" }]);
    };
    // Handle file selection for photo
    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPhoto(reader.result as string);
            reader.readAsDataURL(file);
        }
    };


    return (
        <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="flex flex-col items-center bg-gray-100 text-black p-6 rounded-lg shadow-md w-full">
            <h2 className="text-2xl font-bold mb-4">Contact Info</h2>

            {/* Photo Upload Section */}
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
                    {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                </div>

                {/* Last Name */}
                <div>
                    <label className="block text-xs font-semibold">LAST NAME</label>
                    <input 
                        {...register("lastName", { required: "Last name is required" })} 
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="Last Name"
                    />
                    {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                </div>

                {/* City */}
                <div>
                    <label className="block text-xs font-semibold">CITY</label>
                    <input 
                        {...register("city", { required: "City is required" })} 
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="City"
                    />
                    {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                </div>

                {/* County */}
                <div>
                    <label className="block text-xs font-semibold">COUNTY</label>
                    <input 
                        {...register("country", { required: "County is required" })} 
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="County"
                    />
                    {errors.country && <p className="text-red-500 text-xs">{errors.country.message}</p>}
                </div>

                {/* Postcode */}
                <div>
                    <label className="block text-xs font-semibold">POSTCODE</label>
                    <input 
                        {...register("postcode", { 
                            required: "Postcode is required", 
                            pattern: { value: /^[A-Za-z0-9 ]{3,10}$/, message: "Invalid postcode format" } 
                        })} 
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="Postcode"
                    />
                    {errors.postcode && <p className="text-red-500 text-xs">{errors.postcode.message}</p>}
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-xs font-semibold">PHONE</label>
                    <input 
                        {...register("phone", { 
                            required: "Phone number is required", 
                            pattern: { value: /^[0-9]{10,15}$/, message: "Invalid phone number" } 
                        })} 
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="Phone"
                    />
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                </div>

                {/* Email */}
                <div className="col-span-2">
                    <label className="block text-xs font-semibold">EMAIL</label>
                    
                    <input 
                        {...register("email", { 
                            required: "Email is required", 
                            pattern: { value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, message: "Invalid email format" } 
                        })} 
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="Email"
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>

                 {/* Links */}
                 <div className="col-span-2 space-y-4">
                    <label className="block text-xs font-semibold">LINKS</label>
                    
                    {links.map((link, index) => (
                        <div key={index} className="flex gap-2">
                            {/* Dropdown to select link type */}
                            <select
                                value={link.type}
                                onChange={(e) => handleLinkChange(index, "type", e.target.value)}
                                className="w-1/3 border rounded-md p-2"
                            >
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="GitHub">GitHub</option>
                                <option value="Website">Website</option>
                            </select>

                            {/* Input to enter actual link */}
                            <input
                                type="url"
                                placeholder="https://..."
                                value={link.url}
                                onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                                className="w-2/3 border rounded-md p-2"
                            />
                        </div>
                    ))}

                    {/* Button to add new link */}
                    <button
                        type="button"
                        onClick={addNewLink}
                        className="mt-2 text-blue-500 hover:underline text-sm"
                    >
                        + Add another link
                    </button>
                </div> 
            </div>
            
        </form>
    );
};

export default ContactInfo;

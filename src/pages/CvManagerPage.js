import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { listCVs } from "../services/cv";
import CvCard from "../components/ui-cvmanagement/CvCard";
import NewCvCard from "../components/ui-cvmanagement/NewCvCard";
function errorMessage(e, fallback) {
    if (e && typeof e === "object") {
        const obj = e;
        const resp = obj["response"];
        const data = resp?.["data"];
        if (typeof data === "string")
            return data;
        if (data && typeof data === "object") {
            const msg = data["message"];
            if (typeof msg === "string")
                return msg;
        }
        const direct = obj["message"];
        if (typeof direct === "string")
            return direct;
    }
    return fallback;
}
export default function CvManager() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await listCVs();
                if (mounted)
                    setItems(Array.isArray(data) ? data : []);
            }
            catch (e) {
                setError(errorMessage(e, "Could not load CVs"));
            }
            finally {
                if (mounted)
                    setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);
    return (_jsxs("div", { className: "py-6", children: [_jsx("div", { className: "mb-6 border-b", children: _jsx("nav", { className: "flex gap-6", children: _jsx("button", { className: "pb-3 -mb-px border-b-2 border-blue-500 text-blue-600 font-medium", children: "CV-uri" }) }) }), loading ? (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: [...Array(3)].map((_, i) => (_jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "aspect-[3/4] rounded-xl bg-gray-200" }), _jsx("div", { className: "mt-3 h-4 w-2/3 bg-gray-200 rounded" }), _jsx("div", { className: "mt-2 h-3 w-1/3 bg-gray-200 rounded" })] }, i))) })) : error ? (_jsx("p", { className: "text-red-600", children: error })) : items.length === 0 ? (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "text-gray-600", children: "No CVs yet \u2014 create your first one!" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: _jsx(NewCvCard, {}) })] })) : (_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: [items.map((cv) => {
                        const cardData = {
                            id: cv.id,
                            firstName: cv.firstName,
                            lastName: cv.lastName,
                            jobTitle: cv.jobTitle,
                        };
                        return _jsx(CvCard, { cv: cardData }, cv.id);
                    }), _jsx(NewCvCard, {})] }))] }));
}

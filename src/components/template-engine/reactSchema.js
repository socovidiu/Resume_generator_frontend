import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
// Small helpers for type narrowing
const isRecord = (v) => typeof v === "object" && v !== null;
const isBindObj = (v) => isRecord(v) && typeof v.bind === "string";
const hasItem = (v) => isRecord(v) && "__item" in v;
// -------- Helpers
const get = (obj, path, fallback) => {
    if (path === "." || path === "") {
        if (hasItem(obj))
            return obj.__item; // local-only access, safely typed
        return obj ?? fallback;
    }
    if (!path)
        return fallback;
    return (path.split(".").reduce((acc, key) => {
        if (!isRecord(acc))
            return acc;
        return acc[key];
    }, obj) ?? fallback);
};
const coerce = (v) => {
    if (v == null)
        return "";
    if (typeof v === "string")
        return v;
    if (v instanceof String)
        return v.valueOf();
    if (v instanceof Number || v instanceof Boolean)
        return String(v.valueOf());
    if (Array.isArray(v))
        return v.map(coerce).filter(Boolean).join(", ");
    if (isRecord(v)) {
        const keys = ["name", "label", "title", "text", "value"];
        for (const k of keys)
            if (v[k] != null)
                return coerce(v[k]);
        try {
            return String(v);
        }
        catch {
            return "";
        }
    }
    return String(v);
};
const renderTemplateString = (s, data) => s.replace(/{{\s*([^}]+)\s*}}/g, (_, expr) => coerce(get(data, expr.trim(), "")));
const resolveProps = (props = {}, data) => {
    const out = {};
    for (const [k, v] of Object.entries(props)) {
        if (isBindObj(v)) {
            out[k] = get(data, v.bind, v.default);
        }
        else if (typeof v === "string") {
            out[k] = renderTemplateString(v, data);
        }
        else {
            out[k] = v;
        }
    }
    return out;
};
// -------- Primitive blocks
const Stack = ({ className = "", style, children, gap = 8, ...rest }) => (_jsx("div", { className: `flex flex-col ${className}`, style: { gap, ...style }, ...rest, children: children }));
const Row = ({ className = "", style, children, gap = 8, ...rest }) => (_jsx("div", { className: `flex flex-row ${className}`, style: { gap, ...style }, ...rest, children: children }));
const TextEl = ({ as: As = "p", children, ...rest }) => _jsx(As, { ...rest, children: children });
const Divider = ({ className = "" }) => (_jsx("hr", { className: `border-gray-200 ${className}` }));
function ImageEl({ src, alt, ...rest }) {
    if (!src)
        return null;
    return _jsx("img", { src: src, alt: alt ?? "", ...rest });
}
const COMPONENTS = {
    stack: ({ node, ctx, children }) => {
        const raw = resolveProps(node.props, ctx.data);
        const { className = "", style, gap = 8, noPageBlock, ...rest } = raw;
        const content = (_jsx(Stack, { className: className, style: style, gap: gap, ...rest, children: children }));
        return noPageBlock ? content : _jsx("div", { children: content });
    },
    row: ({ node, ctx, children }) => {
        const raw = resolveProps(node.props, ctx.data);
        const { className = "", style, gap = 8, noPageBlock, ...rest } = raw;
        const content = (_jsx(Row, { className: className, style: style, gap: gap, ...rest, children: children }));
        return noPageBlock ? content : _jsx("div", { children: content });
    },
    text: ({ node, ctx }) => {
        const raw = resolveProps(node.props, ctx.data);
        const { as = "p", className = "", style, children, ...rest } = raw;
        const content = typeof children === "string"
            ? renderTemplateString(children, ctx.data)
            : children;
        return (_jsx(TextEl, { as: as, className: className, style: style, ...rest, children: content }));
    },
    heading: ({ node, ctx }) => {
        const raw = resolveProps(node.props, ctx.data);
        const { level = 2, className = "", style, children, ...rest } = raw;
        const levelNum = Math.min(6, Math.max(1, Number(level ?? 2)));
        const tag = (`h${levelNum}`);
        const content = typeof children === "string"
            ? renderTemplateString(children, ctx.data)
            : children;
        return (_jsx(TextEl, { as: tag, className: className, style: style, ...rest, children: content }));
    },
    image: ({ node, ctx }) => {
        const props = resolveProps(node.props, ctx.data);
        // Narrow common img props we care about, pass the rest as HTML attributes
        const { src, alt, ...rest } = props;
        return (_jsx(ImageEl, { src: typeof src === "string" || src == null ? src : String(src), alt: typeof alt === "string" ? alt : undefined, ...rest }));
    },
    divider: ({ node, ctx }) => {
        const raw = resolveProps(node.props, ctx.data);
        const { className = "" } = raw;
        return _jsx(Divider, { className: className });
    },
    box: ({ node, ctx, children }) => {
        const raw = resolveProps(node.props, ctx.data);
        const { noPageBlock, ...props } = raw; // prevent leaking onto DOM
        const content = (_jsx("div", { ...props, children: children }));
        return noPageBlock ? content : _jsx("div", { children: content });
    },
    pageblock: ({ node, ctx, children }) => {
        const raw = resolveProps(node.props, ctx.data);
        const { className = "", style, ...rest } = raw;
        return (_jsx("div", { "data-page-block": true, className: className, style: style, ...rest, children: children }));
    },
};
// -------- Recursive renderer
const RenderNode = ({ node, ctx, }) => {
    const Comp = COMPONENTS[node.type];
    if (!Comp) {
        console.warn(`Unknown node type: ${node.type}`);
        return null;
    }
    // Repeaters (keep root data like tokens; expose current item via __item)
    if (node.repeat) {
        const list = get(ctx.data, node.repeat, []);
        if (!Array.isArray(list))
            return null;
        return (_jsx(_Fragment, { children: list.map((item, idx) => {
                const merged = isRecord(item)
                    ? { ...(isRecord(ctx.data) ? ctx.data : {}), ...item, __item: item }
                    : { ...(isRecord(ctx.data) ? ctx.data : {}), __item: item };
                return (_jsx("div", { children: _jsx(Comp, { node: node, ctx: { data: merged }, children: node.children?.map((child, i) => (_jsx(RenderNode, { node: child, ctx: { data: merged } }, child.id ?? i))) }) }, (node.id ?? node.type) + "-" + idx));
            }) }));
    }
    return (_jsx(Comp, { node: node, ctx: ctx, children: node.children?.map((child, i) => (_jsx(RenderNode, { node: child, ctx: ctx }, child.id ?? i))) }));
};
// -------- Public component
export const ReactSchemaView = ({ schema, data }) => {
    if (!schema?.root)
        return null;
    return _jsx(RenderNode, { node: schema.root, ctx: { data } });
};

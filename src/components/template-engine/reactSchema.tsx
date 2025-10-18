import React from "react";

// -------- Types
export type SchemaNode = {
  id?: string;
  type: string;
  props?: Record<string, any>;
  children?: SchemaNode[] | ReadonlyArray<SchemaNode>;
  // Optional: repeat over array path in data (e.g., "experience")
  repeat?: string;
};

export type ReactSchema = {
  root: SchemaNode;
};

type RenderCtx = {
  data: any; // CV data object
};

type AsProp = { as?: React.ElementType };


// -------- Helpers
const get = (obj: any, path: string, fallback?: any) => {
  if (!path) return fallback;
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj) ?? fallback;
};

// Replace {{path.to.value}} inside strings with values from data
const renderTemplateString = (s: string, data: any) =>
  s.replace(/{{\s*([^}]+)\s*}}/g, (_, expr) => {
    const v = get(data, expr.trim(), "");
    return v == null ? "" : String(v);
  });

// If a prop is bound like { bind: "path.to.value" } resolve it.
// If a prop is a string with {{ }} interpolate it.
const resolveProps = (props: Record<string, any> = {}, data: any) => {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v && typeof v === "object" && "bind" in v) {
      out[k] = get(data, (v as any).bind, (v as any).default);
    } else if (typeof v === "string") {
      out[k] = renderTemplateString(v, data);
    } else {
      out[k] = v;
    }
  }
  return out;
};

// -------- Primitive building blocks (unstyled + Tailwind-friendly)
const Stack: React.FC<React.HTMLAttributes<HTMLDivElement> & { gap?: number }> = ({
  className = "",
  style,
  children,
  gap = 8,
  ...rest
}) => (
  <div
    className={`flex flex-col ${className}`}
    style={{ gap, ...style }}
    {...rest}
  >
    {children}
  </div>
);

const Row: React.FC<React.HTMLAttributes<HTMLDivElement> & { gap?: number }> = ({
  className = "",
  style,
  children,
  gap = 8,
  ...rest
}) => (
  <div
    className={`flex flex-row ${className}`}
    style={{ gap, ...style }}
    {...rest}
  >
    {children}
  </div>
);

const TextEl: React.FC<React.HTMLAttributes<HTMLElement> & AsProp> = ({
  as: As = "p",
  children,
  ...rest
}) => {
  return <As {...rest}>{children}</As>;
};

const Divider: React.FC<{ className?: string }> = ({ className = "" }) => (
  <hr className={`border-gray-200 ${className}`} />
);

function ImageEl({ src, alt, ...rest }: { src?: string | null; alt?: string; [k: string]: any }) {
  if (!src) return null;                 // <- key line: don't render <img> without a src
  return <img src={src} alt={alt ?? ""} {...rest} />;
}

// -------- Component map
const COMPONENTS: Record<
  string,
  React.FC<{
    node: SchemaNode;
    ctx: RenderCtx;
    children?: React.ReactNode;
  }>
> = {
  stack: ({ node, ctx, children }) => {
    const { className = "", style, gap = 8, ...rest } = resolveProps(node.props, ctx.data);
    return (
      <Stack className={className} style={style} gap={gap} {...rest}>
        {children}
      </Stack>
    );
  },
  row: ({ node, ctx, children }) => {
    const { className = "", style, gap = 8, ...rest } = resolveProps(node.props, ctx.data);
    return (
      <Row className={className} style={style} gap={gap} {...rest}>
        {children}
      </Row>
    );
  },
  text: ({ node, ctx }) => {
    const { as = "p", className = "", style, children, ...rest } = resolveProps(node.props, ctx.data);
    const content =
      typeof children === "string" ? renderTemplateString(children, ctx.data) : children;
    return (
      <TextEl as={as} className={className} style={style} {...rest}>
        {content}
      </TextEl>
    );
  },
  heading: ({ node, ctx }) => {
    const { level = 2, className = "", style, children, ...rest } = resolveProps(node.props, ctx.data);
    const tag = `h${Math.min(6, Math.max(1, Number(level)))}` as unknown as React.ElementType;
    const content =
      typeof children === "string" ? renderTemplateString(children, ctx.data) : children;
    return (
      <TextEl as={tag} className={className} style={style} {...rest}>
        {content}
      </TextEl>
    );
  },
  image: ({ node, ctx }) => {
    const props = resolveProps(node.props, ctx.data);
    const src = node.props?.src;
    const alt = node.props?.alt ?? "";
    return <ImageEl src={src} alt={alt} /* ... */ />;
  },
  
  divider: ({ node, ctx }) => {
    const { className = "" } = resolveProps(node.props, ctx.data);
    return <Divider className={className} />;
  },
  // Generic container if you just want a <div>
  box: ({ node, ctx, children }) => {
    const props = resolveProps(node.props, ctx.data);
    return <div {...props}>{children}</div>;
  },
};

// -------- Recursive renderer
const RenderNode: React.FC<{ node: SchemaNode; ctx: RenderCtx }> = ({ node, ctx }) => {
  const Comp = COMPONENTS[node.type];
  if (!Comp) {
    console.warn(`Unknown node type: ${node.type}`);
    return null;
  }

  // Handle repeaters
  if (node.repeat) {
    const items: any[] = get(ctx.data, node.repeat, []);
    if (!Array.isArray(items)) return null;
    return (
      <>
        {items.map((item, idx) => (
          <Comp key={(node.id ?? node.type) + "-" + idx} node={node} ctx={{ data: item }}>
            {node.children?.map((child, i) => (
              <RenderNode key={child.id ?? i} node={child} ctx={{ data: item }} />
            ))}
          </Comp>
        ))}
      </>
    );
  }

  return (
    <Comp node={node} ctx={ctx}>
      {node.children?.map((child, i) => (
        <RenderNode key={child.id ?? i} node={child} ctx={ctx} />
      ))}
    </Comp>
  );
};

// -------- Public component
export const ReactSchemaView: React.FC<{ schema: ReactSchema; data: any }> = ({ schema, data }) => {
  if (!schema?.root) return null;
  return <RenderNode node={schema.root} ctx={{ data }} />;
};

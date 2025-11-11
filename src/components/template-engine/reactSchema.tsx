import React from "react";

// -------- Types
export type SchemaNode = {
  id?: string;
  type: string;
  props?: Record<string, any>;
  children?: SchemaNode[] | ReadonlyArray<SchemaNode>;
  repeat?: string;
};

export type ReactSchema = { root: SchemaNode };

type RenderCtx = { data: any };
type AsProp = { as?: React.ElementType };

// -------- Helpers
const get = (obj: any, path?: string, fallback?: any) => {
  if (path === "." || path === "") return obj?.__item ?? obj ?? fallback; // support current item in repeats
  if (!path) return fallback;
  return (
    path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj) ??
    fallback
  );
};

const coerce = (v: any): string => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (v instanceof String) return v.valueOf();
  if (v instanceof Number || v instanceof Boolean) return String(v.valueOf());
  if (Array.isArray(v)) return v.map(coerce).filter(Boolean).join(", ");
  if (typeof v === "object") {
    const keys = ["name", "label", "title", "text", "value"];
    for (const k of keys) if (v[k] != null) return coerce(v[k]);
    try {
      return String(v);
    } catch {
      return "";
    }
  }
  return String(v);
};

const renderTemplateString = (s: string, data: any) =>
  s.replace(/{{\s*([^}]+)\s*}}/g, (_, expr) =>
    coerce(get(data, expr.trim(), ""))
  );

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

// -------- Primitive blocks
const Stack: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { gap?: number }
> = ({ className = "", style, children, gap = 8, ...rest }) => (
  <div
    className={`flex flex-col ${className}`}
    style={{ gap, ...style }}
    {...rest}
  >
    {children}
  </div>
);

const Row: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { gap?: number }
> = ({ className = "", style, children, gap = 8, ...rest }) => (
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
}) => <As {...rest}>{children}</As>;

const Divider: React.FC<{ className?: string }> = ({ className = "" }) => (
  <hr className={`border-gray-200 ${className}`} />
);

function ImageEl({
  src,
  alt,
  ...rest
}: {
  src?: string | null;
  alt?: string;
  [k: string]: any;
}) {
  if (!src) return null;
  return <img src={src} alt={alt ?? ""} {...rest} />;
}

// -------- Component map
const COMPONENTS: Record<
  string,
  React.FC<{ node: SchemaNode; ctx: RenderCtx; children?: React.ReactNode }>
> = {
  stack: ({ node, ctx, children }) => {
    const {
      className = "",
      style,
      gap = 8,
      noPageBlock,
      ...rest
    } = resolveProps(node.props, ctx.data);
    const content = (
      <Stack className={className} style={style} gap={gap} {...rest}>
        {children}
      </Stack>
    );
    return noPageBlock ? content : <div>{content}</div>;
  },

  row: ({ node, ctx, children }) => {
    const {
      className = "",
      style,
      gap = 8,
      noPageBlock,
      ...rest
    } = resolveProps(node.props, ctx.data);
    const content = (
      <Row className={className} style={style} gap={gap} {...rest}>
        {children}
      </Row>
    );
    return noPageBlock ? content : <div>{content}</div>;
  },

  text: ({ node, ctx }) => {
    const {
      as = "p",
      className = "",
      style,
      children,
      ...rest
    } = resolveProps(node.props, ctx.data);
    const content =
      typeof children === "string"
        ? renderTemplateString(children, ctx.data)
        : children;
    return (
      <TextEl as={as} className={className} style={style} {...rest}>
        {content}
      </TextEl>
    );
  },

  heading: ({ node, ctx }) => {
    const {
      level = 2,
      className = "",
      style,
      children,
      ...rest
    } = resolveProps(node.props, ctx.data);
    const tag = `h${Math.min(
      6,
      Math.max(1, Number(level))
    )}` as unknown as React.ElementType;
    const content =
      typeof children === "string"
        ? renderTemplateString(children, ctx.data)
        : children;
    return (
      <TextEl as={tag} className={className} style={style} {...rest}>
        {content}
      </TextEl>
    );
  },

  image: ({ node, ctx }) => {
    const props = resolveProps(node.props, ctx.data);
    return <ImageEl {...props} />;
  },

  divider: ({ node, ctx }) => {
    const { className = "" } = resolveProps(node.props, ctx.data);
    return <Divider className={className} />;
  },

  box: ({ node, ctx, children }) => {
    const raw = resolveProps(node.props, ctx.data);
    const { noPageBlock, ...props } = raw; // prevent leaking onto DOM
    const content = <div {...props}>{children}</div>;
    return noPageBlock ? content : <div>{content}</div>;
  },

  pageblock: ({ node, ctx, children }) => {
    const {
      className = "",
      style,
      ...rest
    } = resolveProps(node.props, ctx.data);
    return (
      <div data-page-block className={className} style={style} {...rest}>
        {children}
      </div>
    );
  },
};

// -------- Recursive renderer
const RenderNode: React.FC<{ node: SchemaNode; ctx: RenderCtx }> = ({
  node,
  ctx,
}) => {
  const Comp = COMPONENTS[node.type];
  if (!Comp) {
    console.warn(`Unknown node type: ${node.type}`);
    return null;
  }

  // Repeaters (keep root data like tokens; expose current item via __item)
  if (node.repeat) {
    const items: any[] = get(ctx.data, node.repeat, []);
    if (!Array.isArray(items)) return null;

    return (
      <>
        {items.map((item, idx) => {
          const merged = { ...ctx.data, ...item, __item: item };
          return (
            <div key={(node.id ?? node.type) + "-" + idx}>
              <Comp node={node} ctx={{ data: merged }}>
                {node.children?.map((child, i) => (
                  <RenderNode
                    key={child.id ?? i}
                    node={child}
                    ctx={{ data: merged }}
                  />
                ))}
              </Comp>
            </div>
          );
        })}
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
export const ReactSchemaView: React.FC<{ schema: ReactSchema; data: any }> = ({
  schema,
  data,
}) => {
  if (!schema?.root) return null;
  return <RenderNode node={schema.root} ctx={{ data }} />;
};

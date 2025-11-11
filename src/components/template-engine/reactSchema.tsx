import React from "react";

// -------- Types
export type SchemaNode = {
  id?: string;
  type: string;
  props?: Record<string, unknown>;
  children?: SchemaNode[] | ReadonlyArray<SchemaNode>;
  repeat?: string;
};

export type ReactSchema = { root: SchemaNode };

type RenderCtx = { data: unknown };
type AsProp = { as?: React.ElementType };

// Small helpers for type narrowing
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const isBindObj = (
  v: unknown
): v is { bind: string; default?: unknown } =>
  isRecord(v) && typeof v.bind === "string";

const hasItem = (v: unknown): v is { __item: unknown } =>
  isRecord(v) && "__item" in v
// -------- Helpers
const get = (obj: unknown, path?: string, fallback?: unknown): unknown => {
  if (path === "." || path === "") {
    if (hasItem(obj)) return obj.__item; // local-only access, safely typed
    return obj ?? fallback;
  }
  if (!path) return fallback;

  return (
    path.split(".").reduce<unknown>((acc, key) => {
      if (!isRecord(acc)) return acc;
      return acc[key];
    }, obj) ?? fallback
  );
};
const coerce = (v: unknown): string => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (v instanceof String) return v.valueOf();
  if (v instanceof Number || v instanceof Boolean) return String(v.valueOf());
  if (Array.isArray(v)) return v.map(coerce).filter(Boolean).join(", ");
  if (isRecord(v)) {
    const keys = ["name", "label", "title", "text", "value"] as const;
    for (const k of keys) if (v[k] != null) return coerce(v[k]);
    try {
      return String(v as unknown as object);
    } catch {
      return "";
    }
  }
  return String(v);
};

const renderTemplateString = (s: string, data: unknown): string =>
  s.replace(/{{\s*([^}]+)\s*}}/g, (_, expr) =>
    coerce(get(data, expr.trim(), ""))
  );

const resolveProps = (
  props: Record<string, unknown> = {},
  data: unknown
): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (isBindObj(v)) {
      out[k] = get(data, v.bind, v.default);
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
} & React.ImgHTMLAttributes<HTMLImageElement>) {
  if (!src) return null;
  return <img src={src} alt={alt ?? ""} {...rest} />;
}

// -------- Component map
type CompProps = {
  node: SchemaNode;
  ctx: RenderCtx;
  children?: React.ReactNode;
};

const COMPONENTS: Record<string, React.FC<CompProps>> = {
  stack: ({ node, ctx, children }) => {
    const raw = resolveProps(node.props, ctx.data);
    const {
      className = "",
      style,
      gap = 8,
      noPageBlock,
      ...rest
    } = raw as {
      className?: string;
      style?: React.CSSProperties;
      gap?: number;
      noPageBlock?: boolean;
    } & Record<string, unknown>;

    const content = (
      <Stack
        className={className}
        style={style}
        gap={gap}
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </Stack>
    );
    return noPageBlock ? content : <div>{content}</div>;
  },

  row: ({ node, ctx, children }) => {
    const raw = resolveProps(node.props, ctx.data);
    const {
      className = "",
      style,
      gap = 8,
      noPageBlock,
      ...rest
    } = raw as {
      className?: string;
      style?: React.CSSProperties;
      gap?: number;
      noPageBlock?: boolean;
    } & Record<string, unknown>;

    const content = (
      <Row
        className={className}
        style={style}
        gap={gap}
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </Row>
    );
    return noPageBlock ? content : <div>{content}</div>;
  },

  text: ({ node, ctx }) => {
    const raw = resolveProps(node.props, ctx.data);
    const {
      as = "p",
      className = "",
      style,
      children,
      ...rest
    } = raw as {
      as?: React.ElementType;
      className?: string;
      style?: React.CSSProperties;
      children?: unknown;
    } & Record<string, unknown>;

    const content =
      typeof children === "string"
        ? renderTemplateString(children, ctx.data)
        : (children as React.ReactNode);

    return (
      <TextEl
        as={as}
        className={className}
        style={style}
        {...(rest as React.HTMLAttributes<HTMLElement>)}
      >
        {content}
      </TextEl>
    );
  },

  heading: ({ node, ctx }) => {
    const raw = resolveProps(node.props, ctx.data);
    const {
      level = 2,
      className = "",
      style,
      children,
      ...rest
    } = raw as {
      level?: number | string;
      className?: string;
      style?: React.CSSProperties;
      children?: unknown;
    } & Record<string, unknown>;

    const levelNum = Math.min(6, Math.max(1, Number(level ?? 2)));
    const tag = (`h${levelNum}`) as unknown as React.ElementType;

    const content =
      typeof children === "string"
        ? renderTemplateString(children, ctx.data)
        : (children as React.ReactNode);

    return (
      <TextEl
        as={tag}
        className={className}
        style={style}
        {...(rest as React.HTMLAttributes<HTMLElement>)}
      >
        {content}
      </TextEl>
    );
  },

  image: ({ node, ctx }) => {
    const props = resolveProps(node.props, ctx.data);
    // Narrow common img props we care about, pass the rest as HTML attributes
    const { src, alt, ...rest } = props as {
      src?: string;
      alt?: string;
    } & Record<string, unknown>;
    return (
      <ImageEl
        src={typeof src === "string" || src == null ? src : String(src)}
        alt={typeof alt === "string" ? alt : undefined}
        {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
      />
    );
  },

  divider: ({ node, ctx }) => {
    const raw = resolveProps(node.props, ctx.data);
    const { className = "" } = raw as { className?: string };
    return <Divider className={className} />;
  },

  box: ({ node, ctx, children }) => {
    const raw = resolveProps(node.props, ctx.data);
    const { noPageBlock, ...props } = raw as {
      noPageBlock?: boolean;
    } & Record<string, unknown>; // prevent leaking onto DOM
    const content = (
      <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
    );
    return noPageBlock ? content : <div>{content}</div>;
  },

  pageblock: ({ node, ctx, children }) => {
    const raw = resolveProps(node.props, ctx.data);
    const {
      className = "",
      style,
      ...rest
    } = raw as {
      className?: string;
      style?: React.CSSProperties;
    } & Record<string, unknown>;

    return (
      <div
        data-page-block
        className={className}
        style={style}
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
      >
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
    const list = get(ctx.data, node.repeat, []);
    if (!Array.isArray(list)) return null;

    return (
      <>
        {(list as unknown[]).map((item, idx) => {
          const merged = isRecord(item)
            ? { ...(isRecord(ctx.data) ? ctx.data : {}), ...item, __item: item }
            : { ...(isRecord(ctx.data) ? ctx.data : {}), __item: item };

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
export const ReactSchemaView: React.FC<{ schema: ReactSchema; data: unknown }> =
  ({ schema, data }) => {
    if (!schema?.root) return null;
    return <RenderNode node={schema.root} ctx={{ data }} />;
  };

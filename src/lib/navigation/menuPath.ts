const normalizeRawPath = (path: string) => {
  const trimmed = path.trim();
  if (!trimmed) return "/";

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (withLeadingSlash.length > 1 && withLeadingSlash.endsWith("/")) {
    return withLeadingSlash.slice(0, -1);
  }

  return withLeadingSlash;
};

export const normalizeMenuPath = (path?: string | null) => {
  if (!path) return path ?? null;
  return normalizeRawPath(path);
};

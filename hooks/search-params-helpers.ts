export const parseSearchParam = (value?: string | string[]) =>
    typeof value === "string" ? value : Array.isArray(value) ? value[0] : undefined;

export const parseSearchBoolean = (value?: string | string[]) => {
    const parsed = parseSearchParam(value);

    if (parsed === "true") return true;
    if (parsed === "false") return false;

    return undefined;
};

export const compactParams = <T extends Record<string, any>>(params: T) =>
    Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== "" && value != null),
    ) as Partial<T>;

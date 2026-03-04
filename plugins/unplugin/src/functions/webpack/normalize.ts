const normalizePath = (path: string): string => {
    return path.replace(/\\/g, "/").replace(/^\.\/+/, "");
};

export { normalizePath };

/**
 * Structured logger for server-side use.
 * Replaces raw console.* with prefixed, environment-aware logging.
 * In production, only errors are logged (warnings and info are silenced).
 */

const isProd = process.env.NODE_ENV === "production";

function fmt(level: string, tag: string, ...args: unknown[]) {
    const ts = new Date().toISOString();
    return `[${ts}] [${level}] [${tag}]`;
}

export const logger = {
    /** Critical errors — always logged */
    error(tag: string, ...args: unknown[]) {
        console.error(fmt("ERROR", tag), ...args);
    },
    /** Warnings — dev only */
    warn(tag: string, ...args: unknown[]) {
        if (!isProd) console.warn(fmt("WARN", tag), ...args);
    },
    /** Info — dev only */
    info(tag: string, ...args: unknown[]) {
        if (!isProd) console.info(fmt("INFO", tag), ...args);
    },
    /** Debug — dev only */
    debug(tag: string, ...args: unknown[]) {
        if (!isProd) console.debug(fmt("DEBUG", tag), ...args);
    },
};

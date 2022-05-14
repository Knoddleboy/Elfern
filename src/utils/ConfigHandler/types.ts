export interface ConfigOptions<T extends Record<string, any>> {
    /**
     * Default values used when creating a new config file.
     */
    defaults?: T;

    /**
     * Name of the config file.\
     * Useful if there is need of multiple config files for an app.
     *
     * @default "config"
     */
    configName?: string;

    /**
     * Can be used to change default config location, but no need to use it.
     * @default system config directory
     */
    cwd?: string;

    /**
     * Extension of the config file.
     * @default "json"
     */
    fileExtension?: string;

    /**
     * Access nested properties by dot notation.
     * @default true
     *
     * @example
     * ```
     * {
     *   one: {
     *       two: {
     *           three: "💎"
     *       }
     *   }
     * }
     * config.get("one.two.three");
     * ```
     */
    accessPropertiesByDotNotation?: boolean;

    /**
     * The mode that will be used for the config file.
     * @default 0o666
     */
    readonly configFileMode?: number;
}

export type Serialize<T> = (value: T) => string;
export type Deserialize<T> = (text: string) => T;

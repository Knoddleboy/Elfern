import { readFileSync, writeFileSync } from "fs";
import { isAbsolute, join, resolve } from "path";

import { DotNotation, createPlainObject } from "@utils/utils";
import { ConfigOptions, Deserialize, Serialize } from "./types";

const { ipcRenderer } = require("electron");

// Check if a provided value can be stored in a json file
const verifyValueType = (key: string, value: unknown): void => {
    const nonJsonTypes = new Set(["undefined", "symbol", "function"]);

    const type = typeof value;

    if (nonJsonTypes.has(type)) {
        throw new TypeError(
            `Setting a value of type \`${type}\` for key \`${key}\` is not allowed as it is not supported by JSON`
        );
    }
};

export default class ConfigHandler<T extends Record<string, any> = Record<string, unknown>> {
    readonly #options: Readonly<Partial<ConfigOptions<T>>>;
    readonly path: string;
    private store: T;

    constructor(private configOptions: Partial<ConfigOptions<T>> = {}) {
        const defaultCwd = ipcRenderer.sendSync("store-get-app-data");

        if (configOptions.cwd) {
            configOptions.cwd = isAbsolute(configOptions.cwd) ? configOptions.cwd : join(defaultCwd, configOptions.cwd);
        } else {
            configOptions.cwd = defaultCwd;
        }

        // Reserve options
        this.#options = configOptions;

        this.path = resolve(configOptions.cwd!, `${configOptions.configName}.json`);

        const confStore = this._parseConfigFile();
        this.store = confStore;
    }

    /**
     * Get an item from the store.
     *
     * @param key - The key of the item to get. Can be represented in a form of either a key in the store or a dot notation.
     * @param defaultValue - The default return value if the item does not exist. If not provided - returns an empty object.
     */
    get<Key extends keyof T>(key: Key): T[Key];
    get<Key extends keyof T>(key: Key, defaultValue: Required<T>[Key]): Required<T>[Key];
    get<Key extends keyof T, Value = unknown>(key: Key, defaultValue?: Value): Value;
    get(key: string, defaultValue?: unknown): unknown {
        if (this.#options.accessPropertiesByDotNotation) {
            return DotNotation.getByDotNotation(this.store, key as string, defaultValue);
        }

        const { store } = this;
        return key in store ? store[key] : defaultValue;
    }

    /**
     * Set an item to the store.
     *
     * @param {key|object} - The key of the property to update to a value or a new object to set.
     * @param value - Value to set. Must be JSON serializable. Trying to set the type `undefined`, `function`, or `symbol` will result in a `TypeError`.
     */
    set<Key extends keyof T>(key: Key, value?: T[Key]): void; // Update an already existing property
    set(key: string, value: unknown): void; // Set a new property on an arbitrary object
    set<Key extends keyof T>(key: Partial<T> | Key | string, value?: T[Key] | unknown): void {
        if (typeof key !== "string" && typeof key !== "object") {
            throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof key}`);
        }

        const { store } = this;

        const setValidated = (key: string, value?: T[Key] | T | unknown): void => {
            // Make sure value can be stored in a JSON
            verifyValueType(key, value);

            if (this.#options.accessPropertiesByDotNotation) {
                DotNotation.setByDotNotation(store, key, value);
            } else {
                store[key as Key] = value as T[Key];
            }
        };

        if (typeof key === "object") {
            const object = key;
            for (const [key, value] of Object.entries(object)) {
                setValidated(key, value);
            }
        } else {
            setValidated(key, value);
        }

        // Update the store
        this.store = store;

        writeFileSync(this.path, this._serialize(this.store), {
            encoding: "utf8",
            mode: this.#options.configFileMode,
            flag: "w+",
        });
    }

    // Store getter
    public get getStore(): T {
        return this.store;
    }

    private _parseConfigFile = (): T => {
        // If a config file already exists, just read its content, deserialize and return an object with
        // the obtained properties. If the file does not exist, create it, write default
        // values (if provided) and return an object with default values (or empty object).
        try {
            const storeData = readFileSync(this.path, { encoding: "utf8", flag: "r" });
            const deserializedData = this._deserialize(storeData);

            return Object.assign(deserializedData, createPlainObject());
        } catch (error: any) {
            // If the file does not exist
            if (error?.code === "ENOENT") {
                const defaults = this.#options.defaults || createPlainObject<T>();

                // Create file and write defaults (if provided)
                writeFileSync(this.path, this._serialize(defaults), {
                    encoding: "utf8",
                    mode: this.#options.configFileMode,
                    flag: "w+",
                });

                return Object.assign(defaults, createPlainObject());
            }

            // if something else went wrong...
            throw error;
        }
    };

    private _serialize: Serialize<T> = (value) => JSON.stringify(value, undefined, "  ");
    private _deserialize: Deserialize<T> = (textValue) => JSON.parse(textValue);
}

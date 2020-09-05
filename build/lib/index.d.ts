export interface Y18NOpts {
    directory?: string;
    updateFiles?: boolean;
    locale?: string;
    fallbackToLanguage?: boolean;
}
export interface Locale {
    [key: string]: string;
}
export interface PlatformShim {
    fs: {
        readFileSync: Function;
        writeFile: Function;
    };
    exists: Function;
    format: Function;
    resolve: Function;
}
export declare function y18n(opts: Y18NOpts, _shim: PlatformShim): {
    __: (...args: (string | Function)[]) => string;
    __n: () => any;
    setLocale: (locale: string) => void;
    getLocale: () => string;
    updateLocale: (obj: Locale) => void;
    locale: string;
};

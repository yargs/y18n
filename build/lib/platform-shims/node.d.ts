/// <reference types="node" />
import { readFileSync, writeFile } from 'fs';
import { format } from 'util';
declare const _default: {
    fs: {
        readFileSync: typeof readFileSync;
        writeFile: typeof writeFile;
    };
    format: typeof format;
    resolve: (...pathSegments: string[]) => string;
    exists: (file: string) => boolean;
};
export default _default;

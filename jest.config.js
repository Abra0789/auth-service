import { createDefaultEsmPreset } from 'ts-jest';

const presetConfig = createDefaultEsmPreset();

/** @type {import("jest").Config} **/
export default {
    ...presetConfig,
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    // Allow ESM-style ".js" specifiers in TS sources to resolve to the ".ts" files
    moduleNameMapper: {
        '^(\.{1,2}/.*)\.js$': '$1',
    },
};

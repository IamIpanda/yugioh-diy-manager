/// <reference types="vite/client" />
declare const BUILD_DATE: string;
declare const PACKAGE_VERSION: string;
declare module '*.md' {
    export const html: string;
}

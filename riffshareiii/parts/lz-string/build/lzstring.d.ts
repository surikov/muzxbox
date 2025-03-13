declare module "_compress" {
    export type Dictionary = Record<string, number>;
    export type PendingDictionary = Record<string, true>;
    export function _compress(uncompressed: null, bitsPerChar: number, getCharFromInt: (a: number) => string): "";
    export function _compress(uncompressed: string, bitsPerChar: number, getCharFromInt: (a: number) => string): string;
}
declare module "_decompress" {
    export interface DecompressionTracker {
        val: number;
        position: number;
        index: number;
    }
    export function _decompress(length: number, resetValue: number, getNextValue: (a: number) => number): string | null | undefined;
}
declare module "getBaseValue" {
    export type Dictionary = Record<string, number>;
    export type DictionaryCollection = Record<string, Dictionary>;
    export function getBaseValue(alphabet: string, character: string): number;
}
declare module "UTF16/compressToUTF16" {
    export function compressToUTF16(input: string | null): string;
}
declare module "UTF16/decompressFromUTF16" {
    export function decompressFromUTF16(compressed: string | null): string | null | undefined;
}
declare module "UTF16/index" {
    export { compressToUTF16 } from "UTF16/compressToUTF16";
    export { decompressFromUTF16 } from "UTF16/decompressFromUTF16";
}
declare module "raw/compress" {
    export function compress(input: string | null): string;
}
declare module "Uint8Array/compressToUint8Array" {
    export function compressToUint8Array(uncompressed: string | null): Uint8Array;
}
declare module "raw/decompress" {
    export function decompress(compressed: string | null): string | null | undefined;
}
declare module "Uint8Array/utils" {
    export function convertToUint8Array(data: string | null, forceEven?: boolean): Uint8Array | null;
    export function convertFromUint8Array(data: Uint8Array): string;
}
declare module "Uint8Array/decompressFromUint8Array" {
    export function decompressFromUint8Array(compressed: Uint8Array | null): string | null | undefined;
}
declare module "Uint8Array/index" {
    export { compressToUint8Array } from "Uint8Array/compressToUint8Array";
    export { decompressFromUint8Array } from "Uint8Array/decompressFromUint8Array";
    export { convertFromUint8Array, convertToUint8Array } from "Uint8Array/utils";
}
interface Base64String {
    compress: (input: string) => string;
    decompress: (input: string) => string;
    compressToUTF16: (input: string) => string;
    decompressFromUTF16: (input: string) => string;
    _keyStr: string;
}
declare const Base64String: Base64String;
declare module "base64/keyStrBase64" {
    const _default: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    export default _default;
}
declare module "base64/compressToBase64" {
    export function compressToBase64(input: string | null): string;
}
declare module "base64/decompressFromBase64" {
    export function decompressFromBase64(input: string | null): string | null | undefined;
}
declare module "base64/index" {
    export { compressToBase64 } from "base64/compressToBase64";
    export { decompressFromBase64 } from "base64/decompressFromBase64";
}
declare module "custom/compressToCustom" {
    export function compressToCustom(uncompressed: string | null, dict: string): string;
}
declare module "custom/decompressFromCustom" {
    export function decompressFromCustom(compressed: string | null, dict: string): string | null | undefined;
}
declare module "custom/index" {
    export { compressToCustom } from "custom/compressToCustom";
    export { decompressFromCustom } from "custom/decompressFromCustom";
}
declare module "encodedURIComponent/keyStrUriSafe" {
    const _default_1: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
    export default _default_1;
}
declare module "encodedURIComponent/compressToEncodedURIComponent" {
    export function compressToEncodedURIComponent(input: string | null): string;
}
declare module "encodedURIComponent/decompressFromEncodedURIComponent" {
    export function decompressFromEncodedURIComponent(input: string | null): string | null | undefined;
}
declare module "encodedURIComponent/index" {
    export { compressToEncodedURIComponent } from "encodedURIComponent/compressToEncodedURIComponent";
    export { decompressFromEncodedURIComponent } from "encodedURIComponent/decompressFromEncodedURIComponent";
}
declare module "raw/index" {
    export { compress } from "raw/compress";
    export { decompress } from "raw/decompress";
}

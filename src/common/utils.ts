import Guard from "./guard";
// import { IProject, IProviderOptions, ISecureString } from "../models/applicationState";
// import { encryptObject, decryptObject } from "./crypto";

/**
 * Generates a random integer in provided range
 * @param min Lower bound of random number generation - INCLUSIVE
 * @param max Upper bound of random number generation - EXCLUSIVE
 */
export function randomIntInRange(min: number, max: number) {
    if (min > max) {
        throw new Error(`min (${min}) can't be bigger than max (${max})`);
    }

    if (min === max) {
        return min;
    }

    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
}

/**
 * Common key codes used throughout application
 */
export const KeyCodes = {
    comma: 188,
    enter: 13,
    backspace: 8,
    ctrl: 17,
    shift: 16,
    tab: 9,
};

/**
 * Generates a query string from the key/values of a JSON object
 * @param object The json object
 * @returns A value representing a URL compatible query string
 */
export function createQueryString(object: any): string {
    Guard.null(object);

    const parts: any[] = [];

    for (const key of Object.getOwnPropertyNames(object)) {
        parts.push(`${key}=${encodeURIComponent(object[key])}`);
    }

    return parts.join("&");
}

export function encodeFileURI(path: string, additionalEncodings?: boolean): string {
    // encodeURI() will not encode: ~!@#$&*()=:/,;?+'
    // extend it to support all of these except # and ?
    // all other non encoded characters are implicitly supported with no reason to encoding them
    const matchString = /(#|\?)/g;
    const encodings = {
        "\#": "%23",
        "\?": "%3F",
    };
    const encodedURI = `file:${encodeURI(normalizeSlashes(path))}`;
    if (additionalEncodings) {
        return encodedURI.replace(matchString, (match) => encodings[match]);
    }
    return encodedURI;
}

export function normalizeSlashes(path: string): string {
    return path.replace(/\\/g, "/");
}

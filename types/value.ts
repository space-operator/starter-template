export interface String {
    S: string;
}
export interface Decimal {
    D: string;
}
export interface I64 {
    I: string;
}
export interface U64 {
    U: string;
}
export interface I128 {
    I1: string;
}
export interface U128 {
    U1: string;
}
export interface F64 {
    F: string;
}
export interface Bool {
    B: boolean;
}
export interface Null {
    N: 0;
}
export interface Bytes32 {
    B3: string;
}
export interface Bytes64 {
    B6: string;
}
export interface Bytes {
    BY: string;
}
export interface Array {
    A: Value[];
}
export interface Map {
    M: Record<string, Value>;
}
export interface Value {
    S?: string;
    D?: string;
    I?: string;
    U?: string;
    I1?: string;
    U1?: string;
    F?: string;
    B?: boolean;
    N?: 0;
    B3?: string;
    B6?: string;
    BY?: string;
    A?: Value[];
    M?: Record<string, Value>;
}

export function convertValue(v: Value | null): string | number | boolean | Object | null {
    if (v == null) return null;

    const v0 = v.S ?? v.BY;
    if (v0 != null) return v0;

    const v1 = v.D ?? v.I ?? v.U ?? v.I1 ?? v.U1 ?? v.F;
    if (v1 != null) return Number(v1);

    const v2 = v.B3 ?? v.B6;
    if (v2 != null) return v2;

    if (v.B != null) return v.B;
    if (v.N) return null;
    if (v.A) return v.A.map(convertValue);
    if (v.M) return Object.fromEntries(Object.entries(v.M).map(([k, v]) => [k, convertValue(v)]));
    return null;
}

export function valueToText(v: Value | null): string {
    if (v == null) return 'null';

    const v0 = v.S ?? v.BY;
    if (v0 != null) return v0;

    const v1 = v.D ?? v.I ?? v.U ?? v.I1 ?? v.U1 ?? v.F;
    if (v1 != null) return v1;

    const v2 = v.B3 ?? v.B6;
    if (v2 != null) return v2;

    if (v.B != null) return v.B.toString();
    if (v.N) return 'null';
    if (v.A) return JSON.stringify(convertValue(v));
    if (v.M) return JSON.stringify(convertValue(v));
    return "";
}

/**
 * Helper function for displaying Value on UI.
 * Will trim long text to maximun 256 characters.
 * @param v
 * @returns
 */
export function valuePreview(v: Value | null, maxLength: number = 256): string {
    const text = valueToText(v);
    if (text?.length > maxLength) return text.slice(0, maxLength) + '...';
    else return text;
}

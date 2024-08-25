import { atom } from "jotai";

export const backgroundAtom = atom<File | null>(null);  
export const urlAtom = atom<string | ArrayBuffer | null | undefined>("");
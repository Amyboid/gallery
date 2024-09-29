// import { atom } from "jotai";

// export const backgroundAtom = atom<File | null>(null);
// export const urlAtom = atom<string | ArrayBuffer | null | undefined>("");

// import React from "react";
import { atom } from "jotai";
// interface testDataContextType {
//   testData: string[];
//   setTestData: React.Dispatch<React.SetStateAction<string[]>>;
// }
// export const testDataContext = React.createContext<string[] | null> (null);

export const testDataAtom = atom<string[] | null>(null);

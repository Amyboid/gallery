import { atom } from "jotai";

interface CollectionProps {
  id: number;
  name: string;
  date: string;
  bg: string;
  imgId: string;
  galleryFolder:string;
}

export const testDataAtom = atom<string[] | null>(null);
export const collectionAtom = atom<CollectionProps[]>([]); 
export const isCollectionsVisibleAtom = atom(true);

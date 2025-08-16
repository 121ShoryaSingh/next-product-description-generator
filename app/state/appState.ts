import { atom } from 'recoil';

export const cleanedImageState = atom<File | string | null>({
  key: 'fileState',
  default: null,
});

export const aiDataState = atom<any | null>({
  key: 'aiDataState',
  default: null,
});

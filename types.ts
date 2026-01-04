
export type Language = 'en' | 'zh' | 'es' | 'ru' | 'fr';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum BloodType {
  A = 'A',
  B = 'B',
  AB = 'AB',
  O = 'O',
  UNKNOWN = 'UNKNOWN'
}

export type FortuneType = 'bazi' | 'zodiac' | 'bone_weight' | 'almanac' | 'full_report';

export interface FortuneInput {
  surname: string;
  name: string;
  gender: Gender;
  bloodType: BloodType;
  birthDate: string;
  birthTime?: string;
  birthLocation?: string; // Added field for birth location
  lunarDate?: string; // Added field for precise lunar date passing
  type: FortuneType;
}

export interface Track {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  coverUrl: string;
  url: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

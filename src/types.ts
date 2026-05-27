/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Screen = 'home' | 'timer' | 'survey' | 'recommend' | 'cleansing';

export type SkinType = 'dry' | 'oily' | 'complex' | 'sensitive';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'suncare' | 'cleansing';
  best?: boolean;
  tag?: string;
  buyUrl?: string;
}

export interface SurveyQuestion {
  id: number;
  text: string;
  options: {
    value: string;
    text: string;
  }[];
}

export interface UVHourData {
  hour: string;
  uvIndex: number;
  bgColor: string;
}

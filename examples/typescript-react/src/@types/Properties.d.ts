export interface Properties {
  readonly name: string;
  readonly version: string;
  readonly translations: Translations;
}

export interface Translations {
  readonly random: string;
  readonly randomCached: string;
}

export interface Properties {
  readonly axios: Axios;
  readonly name: string;
  readonly version: string;
  readonly translations: Translations;
}

export interface Axios {
  readonly baseURL: string;
}

export interface Translations {
  readonly random: string;
  readonly randomCached: string;
}

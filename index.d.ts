import { BackendModule, ReadCallback } from "i18next";
import { MMKV } from "react-native-mmkv";

export interface LocalStorageBackendOptions {
  prefix?: string;
  expirationTime?: number;
  versions?: { [key: string]: string };
  defaultVersion?: string;
  store: InstanceType<typeof MMKV>;
}

export default class I18NextLocalStorageBackend
  implements BackendModule<LocalStorageBackendOptions>
{
  static type: "backend";
  constructor(services?: any, options?: LocalStorageBackendOptions);
  init(services?: any, options?: LocalStorageBackendOptions): void;
  read(language: string, namespace: string, callback: ReadCallback): void;
  save(language: string, namespace: string, data: any): void;
  type: "backend";
  services: any;
  options: LocalStorageBackendOptions;
}

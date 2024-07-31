interface IUrlUtil {
  collectionPrefix?: string;
  init({ collectionPrefix }?: { collectionPrefix?: string }): IUrlUtil;
  getBaseUrl(): string;
}
export declare const UrlUtil: IUrlUtil;
export {};

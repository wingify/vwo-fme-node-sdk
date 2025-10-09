interface IUrlUtil {
    collectionPrefix?: string;
    init({ collectionPrefix }?: {
        collectionPrefix?: string;
    }): IUrlUtil;
    getBaseUrl(): string;
    getUpdatedBaseUrl(baseUrl: string): string;
}
export declare const UrlUtil: IUrlUtil;
export {};

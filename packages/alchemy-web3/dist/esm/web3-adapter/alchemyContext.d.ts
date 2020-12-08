import { FullConfig, Provider } from "../types";
export interface AlchemyContext {
    provider: any;
    setWriteProvider(provider: Provider | null | undefined): void;
}
export declare function makeAlchemyContext(url: string, config: FullConfig): AlchemyContext;

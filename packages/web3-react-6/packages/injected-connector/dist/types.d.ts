export declare type SendReturnResult = {
    result: any;
};
export declare type SendReturn = any;
interface RequestArguments {
    method: string;
    params?: unknown[] | object;
}
export declare type Send = (method: string, params?: any[]) => Promise<SendReturnResult | SendReturn>;
export declare type Request = (args: RequestArguments) => Promise<SendReturnResult | SendReturn>;
export declare type SendOld = ({ method }: {
    method: string;
}) => Promise<SendReturnResult | SendReturn>;
export {};

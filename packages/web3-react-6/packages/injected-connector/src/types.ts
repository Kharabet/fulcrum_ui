export type SendReturnResult = { result: any }
export type SendReturn = any
interface RequestArguments {
    method: string;
    params?: unknown[] | object;
  }

export type Send = (method: string, params?: any[]) => Promise<SendReturnResult | SendReturn>
export type Request = (args: RequestArguments) => Promise<SendReturnResult | SendReturn>
export type SendOld = ({ method }: { method: string }) => Promise<SendReturnResult | SendReturn>

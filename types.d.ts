declare module "is-tor-order" {
  type Headers = Record<string, string> | string[] | Array<[string, string]>;
  type IsTorOrderOptions = {
    areRawHeaders: boolean;
    userAgentString: string;
  };

  function isTorOrder(headers: Headers, options: IsTorOrderOptions): boolean;

  export = isTorOrder;
}

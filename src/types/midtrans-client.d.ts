declare module "midtrans-client" {
  interface ClientOptions {
    isProduction?: boolean;
    serverKey?: string;
    clientKey?: string;
  }

  interface TransactionResult {
    token: string;
    redirect_url: string;
    [key: string]: unknown;
  }

  class Snap {
    constructor(options: ClientOptions);
    createTransaction(params: Record<string, unknown>): Promise<TransactionResult>;
  }

  class CoreApi {
    constructor(options: ClientOptions);
    charge(params: Record<string, unknown>): Promise<Record<string, unknown>>;
    transaction: {
      notification(payload: unknown): Promise<Record<string, unknown>>;
      status(orderId: string): Promise<Record<string, unknown>>;
    };
  }

  const midtransClient: { Snap: typeof Snap; CoreApi: typeof CoreApi };
  export default midtransClient;
  export { Snap, CoreApi };
}

export interface IDatabaseClient {
  connect(url: string): Promise<void>;
  disconnect(): Promise<void>;
}

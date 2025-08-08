export interface ApiClient {
    post(path: string, data: unknown): Promise<void>;
}

export class MockApiClient implements ApiClient {
    private calls: { path: string; data: unknown }[] = [];

    async post(path: string, data: unknown): Promise<void> {
        this.calls.push({ path, data });
    }

    getCalls(): { path: string; data: unknown }[] {
        return this.calls;
    }
}

// Type definitions
export interface MessageQueue {
    sendMessage(queue: string, message: string): Promise<void>;
    subscribe(queue: string, callback: (message: string) => void): Promise<void>;
    close(): Promise<void>;
}

export class MockMessageQueue implements MessageQueue {
    private subscribers: Map<string, ((message: string) => void)[]> = new Map();

    async sendMessage(queue: string, message: string): Promise<void> {
        const queueSubscribers = this.subscribers.get(queue) || [];
        for (const subscriber of queueSubscribers) {
            // Simulate async message processing
            setTimeout(() => subscriber(message), 100);
        }
    }

    async subscribe(queue: string, callback: (message: string) => void): Promise<void> {
        if (!this.subscribers.has(queue)) {
            this.subscribers.set(queue, []);
        }
        this.subscribers.get(queue)?.push(callback);
    }

    async close(): Promise<void> {
        this.subscribers.clear();
    }
}

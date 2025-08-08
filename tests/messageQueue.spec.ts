import { expect, test } from '@playwright/test';
import { allure } from 'allure-playwright';
import { MockApiClient } from '../src/components/message-queue/ApiClientComponent';
import { MessageHandler } from '../src/components/message-queue/MessageHandler';
import { MockMessageQueue } from '../src/components/message-queue/MessageQueueComponent';
import { MessageTransformer } from '../src/components/message-queue/MessageTransformer';

const QUEUE_NAME = 'test-queue';
const API_PATH = '/process-data';

// Sample message payload
const samplePayload = {
    id: '12345',
    timestamp: new Date().toISOString(),
    data: {
        type: 'user_action',
        details: {
            action: 'login',
            userId: 'IpsotekUser101'
        }
    }
};

// Expected transformed payload that should be sent to API
const expectedApiPayload = {
    eventId: '12345',
    eventType: 'user_action',
    eventTimestamp: samplePayload.timestamp,
    userData: {
        action: 'login',
        userId: 'IpsotekUser101'
    }
};

test.describe('Message Queue Integration Tests', () => {
    let messageQueue: MockMessageQueue;
    let apiClient: MockApiClient;
    let messageHandler: MessageHandler;
    let transformer: MessageTransformer;

    test.beforeEach(() => {
        messageQueue = new MockMessageQueue();
        apiClient = new MockApiClient();
        transformer = new MessageTransformer();
        messageHandler = new MessageHandler(apiClient, API_PATH, transformer);

        // Setup message consumer
        messageQueue.subscribe(QUEUE_NAME, (message: string) => messageHandler.handleMessage(message));
    });

    test.afterEach(async () => {
        await messageQueue.close();
    });

    test('should process message and call API with transformed data', async () => {
        await allure.step('Send message to queue', async () => {
            const message = JSON.stringify(samplePayload);
            allure.attachment('Message Payload', message, 'application/json');
            await messageQueue.sendMessage(QUEUE_NAME, message);
        });

        await allure.step('Wait for message processing', async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
        });

        await allure.step('Verify API call', async () => {
            const apiCalls = apiClient.getCalls();
            allure.attachment('API Calls', JSON.stringify(apiCalls, null, 2), 'application/json');
            expect(apiCalls.length).toBe(1);
            expect(apiCalls[0].path).toBe(API_PATH);
            expect(apiCalls[0].data).toEqual(expectedApiPayload);
        });
    });

    test('should handle malformed messages gracefully', async () => {
        let errorLogged = false;

        await allure.step('Setup error monitoring', async () => {
            const originalError = console.error;
            console.error = () => { errorLogged = true; };
            allure.attachment('Malformed Payload', '{invalid-json}', 'text/plain');
        });

        await allure.step('Send malformed message', async () => {
            await messageQueue.sendMessage(QUEUE_NAME, '{invalid-json}');
        });

        await allure.step('Wait for error handling', async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
        });

        await allure.step('Verify error handling', async () => {
            expect(errorLogged).toBeTruthy();
            const apiCalls = apiClient.getCalls();
            allure.attachment('API Calls', JSON.stringify(apiCalls), 'application/json');
            expect(apiCalls.length).toBe(0);
        });

        // Restore console.error
        console.error = console.error;
    });

    test('should respect message ordering', async () => {
        const messages = [
            { ...samplePayload, id: '1', sequence: 1 },
            { ...samplePayload, id: '2', sequence: 2 },
            { ...samplePayload, id: '3', sequence: 3 }
        ];

        await allure.step('Send messages in sequence', async () => {
            allure.attachment('Messages to Send', JSON.stringify(messages, null, 2), 'application/json');
            for (const msg of messages) {
                await messageQueue.sendMessage(QUEUE_NAME, JSON.stringify(msg));
            }
        });

        await allure.step('Wait for message processing', async () => {
            await new Promise(resolve => setTimeout(resolve, 1500));
        });

        await allure.step('Verify message processing order', async () => {
            const apiCalls = apiClient.getCalls();
            allure.attachment('API Calls', JSON.stringify(apiCalls, null, 2), 'application/json');
            expect(apiCalls.length).toBe(3);
            const processedIds = apiCalls.map(call => (call.data as any).eventId);
            allure.attachment('Processed Message IDs', JSON.stringify(processedIds), 'application/json');
            expect(processedIds).toEqual(['1', '2', '3']);
        });
    });
});

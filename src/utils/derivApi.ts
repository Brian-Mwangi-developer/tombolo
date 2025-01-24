export class DerivAPI {
    private static ws: WebSocket;
    private static isReady = false;
    private static requestQueue: Array<() => void> = [];
    private static reconnectAttempts = 0;
    private static maxReconnectAttempts = 5;
    private static reconnectDelay = 1000; // Start with 1 second delay
    private static appId = 66642;
    private static wsUrl = `wss://ws.binaryws.com/websockets/v3?app_id=${this.appId}`;

    static initConnection(token?: string) {
        console.log('Initializing WebSocket connection...');
        if (this.ws?.readyState === WebSocket.OPEN) {
            console.log('WebSocket already open, skipping connection initialization.');
            return;
        }

        this.ws = new WebSocket(this.wsUrl);
        console.log('WebSocket created, attempting to connect...');

        this.ws.onopen = () => {
            console.log('WebSocket connected successfully');
            this.isReady = true;
            this.reconnectAttempts = 0;

            // Process queued requests
            while (this.requestQueue.length > 0) {
                const request = this.requestQueue.shift();
                console.log('Processing queued request...');
                request?.();
            }

            if (token) {
                console.log('Sending authorization request...');
                this.sendRequest({ authorize: token });
            }
        };

        this.ws.onclose = () => {
            console.warn('WebSocket connection closed');
            this.isReady = false;
            this.handleReconnection();
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.isReady = false;
        };
    }

    private static handleReconnection() {
        console.log('Handling reconnection...');
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

            setTimeout(() => {
                this.initConnection();
                this.reconnectDelay *= 2; // Exponential backoff
            }, this.reconnectDelay);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    private static sendWhenReady(requestAction: () => void) {
        console.log('Checking WebSocket readiness...');
        if (this.isReady && this.ws.readyState === WebSocket.OPEN) {
            console.log('WebSocket is ready, sending request...');
            requestAction();
        } else {
            console.log('WebSocket is not ready, queuing request...');
            this.requestQueue.push(requestAction);
            if (this.ws?.readyState !== WebSocket.CONNECTING) {
                console.log('WebSocket not connecting, reattempting connection...');
                this.initConnection(); // Attempt to reconnect if not already connecting
            }
        }
    }

    static sendRequest(request: object): Promise<any> {
        console.log('Sending request:', request);
        return new Promise((resolve, reject) => {
            const timeoutDuration = 30000; // 30 seconds timeout
            let timeoutId: NodeJS.Timeout;

            const handleMessage = (event: MessageEvent) => {
                console.log('Received message:', event.data);
                const response = JSON.parse(event.data);

                if (response.msg_type === Object.keys(request)[0] || response.error?.code) {
                    console.log('Received valid response:', response);
                    clearTimeout(timeoutId);
                    this.ws.removeEventListener('message', handleMessage);

                    if (response.error) {
                        console.error('Error in response:', response.error);
                        reject(new Error(response.error.message));
                    } else {
                        resolve(response);
                    }
                } else {
                    console.log('Received unrelated response:', response);
                }
            };

            const sendRequestAction = () => {
                console.log('Sending request action...');
                this.ws.addEventListener('message', handleMessage);
                this.ws.send(JSON.stringify(request));

                timeoutId = setTimeout(() => {
                    console.log('Request timeout reached');
                    this.ws.removeEventListener('message', handleMessage);
                    reject(new Error('Request timeout'));
                }, timeoutDuration);
            };

            if (this.isReady && this.ws.readyState === WebSocket.OPEN) {
                sendRequestAction();
            } else {
                this.sendWhenReady(sendRequestAction);
            }
        });
    }

    static requestSubscribe(request: object, callback: (data: Record<string, unknown>) => void) {
        console.log('Subscribing with request:', request);
        let subscriptionId: string | null = null;

        const handleMessage = (event: MessageEvent) => {
            console.log('Received subscription message:', event.data);
            const response = JSON.parse(event.data);

            if (response.subscription?.id) {
                subscriptionId = response.subscription.id;
                console.log('Subscription ID:', subscriptionId);
            }

            callback(response);
        };

        this.sendWhenReady(() => {
            console.log('Sending subscribe request...');
            this.ws.addEventListener('message', handleMessage);
            this.ws.send(JSON.stringify({
                ...request,
                subscribe: 1
            }));
        });

        // Return unsubscribe function
        return () => {
            console.log('Unsubscribing...');
            if (subscriptionId) {
                this.requestForget({ forget: subscriptionId });
            }
            this.ws?.removeEventListener('message', handleMessage);
        };
    }

    static requestForget(request: object, callback: (data: any) => void) {
        console.log('Sending forget request:', request);
        this.sendWhenReady(() => {
            this.ws.send(JSON.stringify(request));
        });
    }
}





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
        if (this.ws?.readyState === WebSocket.OPEN) return;

        this.ws = new WebSocket(this.wsUrl);

        this.ws.onopen = () => {
            console.log('WebSocket connected successfully');
            this.isReady = true;
            this.reconnectAttempts = 0;

            // Process queued requests
            while (this.requestQueue.length > 0) {
                const request = this.requestQueue.shift();
                request?.();
            }

            if (token) {
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
        if (this.isReady && this.ws.readyState === WebSocket.OPEN) {
            requestAction();
        } else {
            this.requestQueue.push(requestAction);
            // Start connection attempts again only if not connecting
            if (this.ws?.readyState !== WebSocket.CONNECTING) {
                this.initConnection(); // Attempt to reconnect if not already connecting
            }
        }
    }

    static sendRequest(request: object): Promise<any> {
        return new Promise((resolve, reject) => {
            const timeoutDuration = 30000; // 30 seconds timeout
            let timeoutId: NodeJS.Timeout;

            const handleMessage = (event: MessageEvent) => {
                const response = JSON.parse(event.data);

                // Check if this is the response we're waiting for
                if (response.msg_type === Object.keys(request)[0] || response.error?.code) {
                    clearTimeout(timeoutId);
                    this.ws.removeEventListener('message', handleMessage);

                    if (response.error) {
                        reject(new Error(response.error.message));
                    } else {
                        resolve(response);
                    }
                }
            };

            const sendRequestAction = () => {
                this.ws.addEventListener('message', handleMessage);
                this.ws.send(JSON.stringify(request));

                timeoutId = setTimeout(() => {
                    this.ws.removeEventListener('message', handleMessage);
                    reject(new Error('Request timeout'));
                }, timeoutDuration);
            };

            // Check if the WebSocket is ready before sending
            if (this.isReady && this.ws.readyState === WebSocket.OPEN) {
                sendRequestAction();
            } else {
                // Use sendWhenReady if the WebSocket is not ready
                this.sendWhenReady(sendRequestAction);
            }
        });
    }

    static subscribe(request: object, callback: (data: Record<string, unknown>) => void) {
        let subscriptionId: string | null = null;

        const handleMessage = (event: MessageEvent) => {
            const response = JSON.parse(event.data);

            if (response.subscription?.id) {
                subscriptionId = response.subscription.id;
            }

            callback(response);
        };

        this.sendWhenReady(() => {
            this.ws.addEventListener('message', handleMessage);
            this.ws.send(JSON.stringify({
                ...request,
                subscribe: 1
            }));
        });

        // Return unsubscribe function
        return () => {
            if (subscriptionId) {
                this.forgetRequest({ forget: subscriptionId });
            }
            this.ws?.removeEventListener('message', handleMessage);
        };
    }

    static forgetRequest(request: object) {
        this.sendWhenReady(() => {
            this.ws.send(JSON.stringify(request));
        });
    }
}
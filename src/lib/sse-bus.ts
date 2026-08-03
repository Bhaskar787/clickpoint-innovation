type ClientSubscriber = (data: any) => void;
const subscribers = new Set<ClientSubscriber>();

export function notifySSESubscribers(eventData: any) {
  subscribers.forEach((send) => {
    try {
      send(eventData);
    } catch (e) {
      console.error("Error sending to SSE subscriber", e);
    }
  });
}

export function registerSSESubscriber(send: ClientSubscriber) {
  subscribers.add(send);
  return () => {
    subscribers.delete(send);
  };
}

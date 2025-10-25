type Listener = (message: string) => void;

class NotifyBus {
  subscribe(_listener: Listener): () => void {
    // this.listeners.add(listener);
    // return () => this.listeners.delete(listener);
    return () => {};
  }

  show(_message: string) {
    // for (const listener of this.listeners) listener(message);
  }
}

export const notify = new NotifyBus();



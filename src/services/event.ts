/**
 * Simple event bus service.
 * 
 * @author Felix Voituret <oss@voituret.fr>
 */

import { Event } from '../models/event';

class EventService {

    /**
     * Singleton access method.
     *
     * @returns Service instance.
     */
    public static getInstance(): EventService {
        if (!EventService.instance) {
            EventService.instance = new EventService();
        }
        return EventService.instance;
    }

    /** Singleton unique instance. */
    private static instance: EventService;

    /** Event listeners as event type indexed map. */
    private listeners: Map<Event, Array<(e: any) => void>>;

    /** Default constructor. */
    private constructor() {
        this.listeners = new Map<Event, Array<(e: any) => void>>();
    }

    /**
     * Register the given listener for the given event type.
     *
     * @param e Event to register listener for.
     * @param listener Listener to be registered.
     */
    public on(e: Event, listener: (e: any) => void): void {
        if (!this.listeners.has(e)) {
            this.listeners.set(e, []);
        }
        const listeners = this.listeners.get(e);    
        // @ts-ignore: Object is possibly 'null'.
        listeners.push(listener);
    }

    /**
     * Unregister the given listener for the given event type. 
     *
     * @param e Event to unregister listener for.
     * @param listener Listener to be unregistered.
     */
    public off(e: Event, listener: (e: any) => void): void {
        if (this.listeners.has(e)) {
            const listeners = this.listeners.get(e);
            // @ts-ignore: Object is possibly 'null'.
            const index = listeners.indexOf(listener);
            if (index > -1) {
                // @ts-ignore: Object is possibly 'null'.
                listerners.splice(index, 1);
            }
        }
    }

    /**
     * Trigger the given event type with given data.
     *
     * @param e Event to be triggered.
     * @param data (Optional) Event associated data.
     */
    public emit(e: Event, data?: Object) {
        if (this.listeners.has(e)) {
            // @ts-ignore: Object is possibly 'null'.
            for (const listener of this.listeners.get(e)) {
                listener(data);
            }
        }
    }

}

// Export singleton instance.
export const eventService = EventService.getInstance();

/**
 * 
 * @author Felix Voituret <oss@voituret.fr>
 */

import Point from '@/models/geometry/point';
import Size from '@/models/geometry/size';

type OffsetEventListener = (event: Point) => void;
type RatioEventListener = (event: Size) => void;
type ResizableEventListener = OffsetEventListener | RatioEventListener;

export default class ResizableElement {

    /** */
    // Note: to be use for child related calculation.
    public readonly offset: Point = { x: 0, y: 0, };

    /** Concrete size of this resizable element. */
    public readonly size: Size;

    /** Wrapped element with resizing control feature. */
    public readonly element: HTMLElement;

    /** Resizing ratio currently applied. */
    private readonly ratio: Size = { width: 1, height: 1, };

    /** Custom event listeners bind to this element. */
    private readonly listeners: Map<string, ResizableEventListener[]> = new Map();

    /**
     * Default constructor.
     *
     * @param element Wrapped element with resizing control feature.
     */
    public constructor(element: HTMLElement) {
        this.element = element;
        this.size = this.resizeWatch({
            width: element.clientWidth,
            height: element.clientHeight,
        });
        window.addEventListener('resize', () => this.onResize());
        element.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    /**
     * Proxify the given target by adding #onResize
     * call when updated (trap for set operation).
     *
     * @param target Object to profixy.
     * @returns Proxified instance.
     */
    public resizeWatch<T>(target: T): T {
        const self = this;
        const handler = {
            set(target: any, key: string | number | symbol, value: any, receiver: any): boolean {
                const result = Reflect.set(target, key, value, receiver);
                self.onResize();
                return result;
            },
        };
        return new Proxy(target, handler);
    }

    /**
     * Add the given listener for the given event type.
     *
     * @param type Event type to add listener for.
     * @param listener Listener to register.
     */
    public addEventListener(type: string, listener: ResizableEventListener): void {
        const listeners = this.listeners.get(type);
        if (listeners) {
            listeners.push(listener);
        }
        else {
            this.listeners.set(type, [listener]);
        }
    }

    /**
     * Dispatch event of the given type to all registered listeners.
     *
     * @param type Type of the event to dispatch.
     * @param event Event to dispatch.
     */
    private dispatchEvent(type: string, event?: any) {
        const listeners = this.listeners.get(type);
        if (listeners) {
            for (const listener of listeners) {
                listener(event);
            }
        }
    }

    /**
     * Handle delegate element mouse event by applying ResizableElement
     * event management method using target event position or child
     * relative crafted position depending on the given event target.
     *
     * Note: rename to avoid merge conflict.
     *
     * @param event Mouse move event to handle.
     */
    private onMouseMove(event: MouseEvent): void {
        if (this.element == event.target) {
            const offset: Point = {
                x: event.offsetX,
                y: event.offsetY,
            };
            this.dispatchEvent('mousemove', offset);
            this.onResizedMouseMove(offset);
        }
        // TODO: Consider mouse move for child.
        /**for (const child of this.childs) {
        if (child.element == event.target) {
            const offset = {
                x: event.offsetX + child.offset.x,
                y: event.offsetY + child.offset.y,
            };
            this.emitMoveEvent(offset);
            this.backgroundElement.onResizedMouseMove(offset);
         }}*/
    }

    /**
     * When a new mouse move position is given (with concrete
     * relative offset) it computes a ratio reversed position
     * and trigger associated listeners with it.
     *
     * @param offset Parent container captured mouse move offset.
     */
    private onResizedMouseMove(offset: Point): void {
        const resizedOffset = {
            x: offset.x * this.ratio.width,
            y: offset.y * this.ratio.height,
        };
        this.dispatchEvent('resizedmousemove', resizedOffset);
    }

    /**
     * Recompute container ratio when resize event occurs.
     */
    public onResize(): void {
        this.ratio.width = (this.size.width / this.element.clientWidth);
        this.ratio.height = (this.size.height / this.element.clientHeight);
        this.dispatchEvent('resize', this.ratio);
    }

};

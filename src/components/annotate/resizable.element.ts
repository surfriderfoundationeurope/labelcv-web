/**
 * 
 * @author Felix Voituret <oss@voituret.fr>
 */

import Point from '@/models/geometry/point';
import Size from '@/models/geometry/size';

import {
    OffsetEventListener,
    RatioEventListener, } from '@/models/geometry/listeners';
import {
    ResizedMoveEventSupport,
    ResizedEventSupport,  } from './resizable.support';

export default class ResizableElement
    implements ResizedEventSupport, ResizedMoveEventSupport {

    /** */
    public readonly offset: Point = { x: 0, y: 0, };

    /** Concrete size of this resizable element. */
    public readonly size: Size;

    /** Wrapped element with resizing control feature. */
    public readonly element: HTMLElement;

    /** Resizing ratio currently applied. */
    // Note : consider switch to readonly for safety.
    private ratio: Size = { width: 1, height: 1, };

    /** Listeners that check for mouse move event with reversed ratio. */
    private readonly moveListeners: OffsetEventListener[] = [];

    /** */
    private readonly resizeListeners: RatioEventListener[] = [];

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
    }

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

    /** @inheritdoc */
    public addResizedMoveEventListener(listener: OffsetEventListener) : void {
        this.moveListeners.push(listener);
    }

    /** @inheritdoc */
    public addResizedEventListener(listener: RatioEventListener): void {
        this.resizeListeners.push(listener);
        listener(this.ratio);
    }

    /**
     * When a new mouse move position is given (with concrete
     * relative offset) it computes a ratio reversed position
     * a trigger associated listeners with it.
     *
     * @param offset Parent container captured mouse move offset.
     */
    public onResizedMouseMove(offset: Point): void {
        const resizedOffset = {
            x: offset.x * this.ratio.width,
            y: offset.y * this.ratio.height,
        };
        for (const listener of this.moveListeners) {
            listener(resizedOffset);
        }
    }

    /**
     * Recompute container ratio when resize event occurs.
     */
    public onResize(): void {
        this.ratio.width = (
            this.size.width
            / this.element.clientWidth);
        this.ratio.height = (
            this.size.height
            / this.element.clientHeight);
        for (const listener of this.resizeListeners) {
            listener(this.ratio);
        }
    }

};

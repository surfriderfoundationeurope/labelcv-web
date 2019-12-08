/**
 * 
 * @author Felix Voituret <oss@voituret.fr>
 */

import Point from '@/models/geometry/point';
import Size from '@/models/geometry/size';

import { OffsetEventListener } from  '@/models/geometry/listeners';
// Note: Consider using mixin if more support is needed.
import { ResizedMoveEventSupport } from './resizable.support';

export default class ResizableElement implements ResizedMoveEventSupport {

    /** Element offset relative to this parent container. */
    public readonly offset: Point;

    /** Wrapped element with resizing control feature. */
    public readonly element: HTMLElement;

    /** Concrete size of this resizable element. */
    // Note : consider switch to readonly for safety.
    private size: Size;

    /** Resizing ratio currently applied. */
    // Note : consider switch to readonly for safety.
    private ratio: Size = { width: 1, height: 1, };

    /** Listeners that check for mouse move event with reversed ratio. */
    private readonly listeners: OffsetEventListener[] = [];

    /**
     * Default constructor.
     *
     * @param element Wrapped element with resizing control feature.
     */
    public constructor(element: HTMLElement) {
        this.element = element;
        this.offset = { x: 0, y: 0 }; // TODO: Consider adding relative position.
        this.size = {
            width: element.clientWidth,
            height: element.clientHeight,
        };
        window.addEventListener('resize', () => this.onResize());
    }

    /**
     * Add the given resized move event listener.
     *
     * @param listener Listener to add.
     */
    public addResizedMoveEventListener(listener: OffsetEventListener) : void {
        this.listeners.push(listener);
    }

    /**
     * Element size setter. To be used when we want to configure
     * a specific target size such as an image natural size.
     *
     * Trigger an internal resize event.
     *
     * @param size Concrete size of this resizable element.
     */
    public setResizableElementSize(size: Size): void {
        this.size = {
            width: size.width,
            height: size.height,
        };
        this.onResize();
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
        for (const listener of this.listeners) {
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
    }

};

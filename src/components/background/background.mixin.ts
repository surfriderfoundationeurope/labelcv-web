/**
 * 
 */
import Vue from 'vue';
import { Mixin } from 'vue-mixin-decorator';

import Point from '@/models/geometry/point';
import Size from '@/models/geometry/size';
import { OffsetEventListener } from '@/models/geometry/listeners';

import ResizableElement from '../resizable/resizable.element';
import { ResizedMoveEventSupport } from '../resizable/resizable.support';

@Mixin
class BackgroundImageMixin extends Vue implements ResizedMoveEventSupport {

    /** */
    public imageReady: Boolean = false;

    /** */
    private imageLoader?: HTMLImageElement;

    /** */
    private readonly backgroundSize: Size = { width: NaN, height: NaN };

    /** */
    // Note: consider using resizableElement directly.
    private backgroundElement?: ResizableElement;

    /** */
    private readonly childs: ResizableElement[] = [];

    /** */
    private readonly moveListeners: OffsetEventListener[] = [];

    /** @inheritdoc */
    public addResizedMoveEventListener(listener: OffsetEventListener): void {
        if (!this.backgroundElement) {
            throw ''; // TODO: Customize error.
        }
        this.backgroundElement.addResizedMoveEventListener(listener);
    }

    /**
     * 
     * @param listener 
     */
    public addMoveEventListener(listener: OffsetEventListener): void {
        this.moveListeners.push(listener);
    }

    /**
     * 
     * @param child 
     */
    public addChild(child: ResizableElement | HTMLElement): void {
        // TODO: Prevent from duplicate (consider ChildSet).
        if (child instanceof HTMLElement) {
            child = new ResizableElement(child);
        }
        this.childs.push(child);
    }

    /**
     * 
     * @param child 
     */
    public removeChild(child: ResizableElement | HTMLElement): void {
        for (let i = 0; i < this.childs.length; i++) {
            if ((child instanceof ResizableElement
                && this.childs[i] == child)
                || (child instanceof HTMLElement
                    && this.childs[i].element == child)) {
                this.childs.splice(i--, 1);
            }
        }
    }

    /**
     * 
     * @param container 
     */
    protected onBackgroundElementMounted(element: HTMLElement): void {
        this.backgroundElement = new ResizableElement(element);
        element.addEventListener(
            'mousemove',
            this.onBackgroundMouseMove);
    }

    /**
     * 
     * @param container 
     */
    protected onBackgroundLoaderMounted(loader: HTMLImageElement): void {
        loader.onload = () => {
            this.applyBackground();
            this.backgroundSize.width = loader.naturalWidth;
            this.backgroundSize.height = loader.naturalHeight;
            console.log(`Image size: ${loader.naturalWidth} x ${loader.naturalHeight}`);
            if (this.backgroundElement) {
                this.backgroundElement.setResizableElementSize(
                    this.backgroundSize);
            }
            this.imageReady = true;
            // TODO: Handle non mounted case.
        };
        // Note: force reload to ensure onload callback is used.
        this.imageLoader = loader;
        this.loadImage(loader.src);        
    }

    /**
     * 
     * @param url 
     */
    protected loadImage(url: string): void {
        if (this.imageLoader) {
            const tokens: string[] = url.split('?');
            const seed: number = Date.now();
            const cacheless: string = `${tokens[0]}?${seed}`;
            this.imageReady = false;
            this.imageLoader.src = cacheless;
        }
    }

    /**
     * 
     */
    protected applyBackground(): void {
        if (this.backgroundElement && this.imageLoader) {
            const style = this.backgroundElement.element.style;
            style.backgroundImage = `url('${this.imageLoader.src}')`;
            // TODO: Consider parameter this with cropping / positionning.
            style.backgroundRepeat = 'no-repeat';
            style.backgroundPosition = '0 0';
            style.backgroundSize = '100% 100% !important';
        }
    }

    /**
     * TODO: Switch to Rect.
     * @param viewport 
     */
    public applyViewport(viewport: Point): void {
        if (this.backgroundElement) {
            const x = Math.round(
                viewport.x
                - (this.backgroundElement.element.clientWidth / 2));
            const y = Math.round(
                viewport.y
                - (this.backgroundElement.element.clientHeight / 2));
            this.backgroundElement.element.style.backgroundPosition = `-${x}px -${y}px`;
        }
    }

    private emitMoveEvent(offset: Point): void {
        for (const listener of this.moveListeners) {
            listener(offset);
        }
    }

    /**
     * Handle delegate element mouse event by applying ResizableElement
     * event management method using target event position or child
     * relative crafted position depending on the given event target.
     *
     * @param event Mouse move event to handle.
     */
    protected onBackgroundMouseMove(event: MouseEvent): void {
        if (this.backgroundElement) {
            if (this.backgroundElement.element == event.target) {
                const offset: Point = {
                    x: event.offsetX,
                    y: event.offsetY,
                };
                this.emitMoveEvent(offset);
                this.backgroundElement.onResizedMouseMove(offset);
            }
            else {
                for (const child of this.childs) {
                    if (child.element == event.target) {
                        const offset = {
                            x: event.offsetX + child.offset.x,
                            y: event.offsetY + child.offset.y,
                        };
                        this.emitMoveEvent(offset);
                        this.backgroundElement.onResizedMouseMove(offset);
                    }
                }
            }
        }
    }

}

export default BackgroundImageMixin;

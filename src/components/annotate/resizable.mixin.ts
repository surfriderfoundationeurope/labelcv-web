/**
 * 
 */
import Vue from 'vue';
import { Mixin } from 'vue-mixin-decorator';

import ResizableElement from './resizable.element';

@Mixin
export default class ResizableComponentMixin extends Vue {

    /** */
    private resizableElement?: ResizableElement;

    /** */
    private readonly childs: ResizableElement[] = [];

    /** @inheritdoc */
    public addChild(child: ResizableElement | HTMLElement): void {
        // TODO: Prevent from duplicate (consider ChildSet).
        if (child instanceof HTMLElement) {
            child = new ResizableElement(child);
        }
        // TODO: Apply ratio to child.
        this.childs.push(child);
    }

    /** @inheritdoc */
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
     * @param element 
     */
    public onResizableElementReady(element: HTMLElement): void {
        this.resizableElement = new ResizableElement(element);
    }

    /**
     * 
     * @param consumer 
     */
    public withResizableElement(consumer: (resizableElement: ResizableElement) => void): void {
        if (this.resizableElement) {
            consumer(this.resizableElement);
        }
    }

};

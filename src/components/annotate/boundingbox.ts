/**
 * 
 */

import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import Box from '../../models/geometry/box';
import Size from '../../models/geometry/size';
import Point from '../../models/geometry/point';

import ResizableElement from './resizable.element';

@Component({})
export default class BoundingBox extends Vue {

    private readonly offset: Point = { x: 0, y: 0, };
    private readonly size: Size = { width: 0, height: 0, };
    private isSelected: boolean = false;

    private box?: Box;

    public configure(
            box: Box,
            parent: ResizableElement): void {
        this.box = box;
        console.log(`Adding box : ${box.x},${box.y},${box.width},${box.height}`);
        const container = document.createElement('div');
        parent.addEventListener(
            'resize',
            (ratio) => this.onResize(ratio));
        parent.element.appendChild(container);
        parent.onResize();
        this.$mount(container);
    }

    /** Rendering method. */
    protected render(createElement: any): VNode {
        return createElement('div', {
            class: {
                'bounding-box': true,
            },
            style: {
                top: `${this.offset.y}px`,
                left: `${this.offset.x}px`,
                width: `${this.size.width}px`,
                height: `${this.size.height}px`,
            }
        });
    }

    /**
     * 
     * @param ratio 
     */
    public onResize(ratio: Size): void {
        console.log(`Apply ratio ${ratio.width}, ${ratio.height}`)
        if (this.box) {
            this.offset.x = Math.round((1 / ratio.width) * this.box.x);
            this.offset.y = Math.round((1 / ratio.height) * this.box.y);
            this.size.width = Math.round((1 / ratio.width) * this.box.width);
            this.size.height = Math.round((1 / ratio.height) * this.box.height);
        }
  }

}
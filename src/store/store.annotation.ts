/**
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import { Module, VuexModule, Mutation } from 'vuex-module-decorators';

import Box from '../models/geometry/box';
import Size from '../models/geometry/size';
import Point from '@/models/geometry/point';

import store from './store';

@Module({
    name: 'annotation',
    store,
    dynamic: true,
    namespaced: true})
export default class AnnotationStore extends VuexModule {

    /** */
    // Note: consider using more complex structure like id.
    public image: string = '';

    /** */
    public imageLoader: HTMLImageElement | undefined;

    /** */
    public imageLoaded: boolean = false;

    /** */
    public readonly imageSize: Size = { width: 0, height: 0 };

    /** */
    public readonly imageRatio: Size = { width: 1, height: 1 };

    /** */
    public boxes: Box[] = [];

    /** */
    public selectedBox: number = NaN;

    /** */
    public readonly relativeCursor: Point = { x: 0, y: 0 };

    @Mutation
    public resetAnnotations(): void {
        this.boxes = [];
    }

    @Mutation
    public loadImage(url: string | undefined): void {
        if (url) {
            const tokens: string[] = url.split('?');
            const seed: number = Date.now();
            const cacheless: string = `${tokens[0]}?${seed}`;
            this.imageLoaded = false;
            this.image = cacheless;
            if (this.imageLoader) {
                this.imageLoader.src = cacheless;
            }
        }
    }

    @Mutation
    public registerImageLoader(imageLoader: HTMLImageElement): void {
        imageLoader.onload = () => {
            this.imageLoaded = true;
            this.imageSize.width = imageLoader.naturalWidth;
            this.imageSize.height = imageLoader.naturalHeight;
            // Note: ensure ratio is updated once loaded.
            window.dispatchEvent(new Event('resize'));
        };
        this.imageLoader = imageLoader;
        if (this.image) {
            this.imageLoader.src = this.image;
        }
    }

    @Mutation
    public addAnnotation(box: Box): void {
        // TODO: Compare with size threshold (@see #12).
        this.selectedBox = this.boxes.push(box) - 1;
    }

    @Mutation
    public select(id: number): void {
        if (
            !isNaN(id)
            && this.boxes.length > 0
            && id >= 0
            && id < this.boxes.length) {
            this.selectedBox = id;
        }
    }

    @Mutation
    public selectPrevious(): void {
        if (this.boxes.length > 0) {
            if (isNaN(this.selectedBox) || this.selectedBox === 0) {
                this.selectedBox = this.boxes.length - 1;
            } else {
                this.selectedBox = this.selectedBox - 1;
            }
        }
    }

    @Mutation
    public selectNext(): void {
        if (this.boxes.length > 0) {
            if (isNaN(this.selectedBox) || this.selectedBox === this.boxes.length - 1) {
                this.selectedBox = 0;
            } else {
                this.selectedBox = this.selectedBox + 1;
            }
        }
    }

    @Mutation
    public updateRatio(imageHolder: HTMLElement): void {
        this.imageRatio.width = this.imageSize.width / imageHolder.clientWidth;
        this.imageRatio.height = this.imageSize.height / imageHolder.clientHeight;
    }

    @Mutation
    public updateRelativeCursor(offset: Point): void {
        if (offset.x >= 0
            && offset.y >= 0
            && offset.x <= this.imageSize.width
            && offset.y <= this.imageSize.height) {
            this.relativeCursor.x = Math.round(offset.x);
            this.relativeCursor.y = Math.round(offset.y);
        }
    }

}

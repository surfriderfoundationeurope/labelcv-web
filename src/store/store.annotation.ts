/**
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';

import Box from '@/models/geometry/box';
import Size from '@/models/geometry/size';
import Point from '@/models/geometry/point';
import { Annotation, AnnotationClass } from '@/models/annotation';

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

    /** HTML <img> element used as image loader. */
    public imageLoader: HTMLImageElement | undefined;

    /** Boolean flag indicated if the current image is fully loaded. */
    public imageLoaded: boolean = false;

    /** Annotated image real size.  */
    public readonly imageSize: Size = { width: 0, height: 0 };

    /** Applied image ratio to the annotation surface. */
    public readonly imageRatio: Size = { width: 1, height: 1 };

    /** Reverse applied image ratio. */
    public readonly imageReverseRatio: Size = { width: 1, height: 1 };

    /** List of user's drawn annotations. */
    public annotations: Annotation[] = [];

    /** List of annotation classes available for the current image. */
    public annotationClasses: AnnotationClass[] = [];

    /** Index of the currently selected annotation if any, NaN otherwise. */
    public selectedAnnotation: number = NaN;

    /** Current user cursor position (relative to real image size). */
    public readonly relativeCursor: Point = { x: 0, y: 0 };

    @Mutation
    public resetAnnotations(): void {
        this.selectedAnnotation = NaN;
        this.annotations = [];
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
        this.selectedAnnotation = this.annotations.push({box}) - 1;
    }

    @Mutation
    public addAnnotationClass(annotationClass: AnnotationClass): void {
        this.annotationClasses.push(annotationClass);
    }

    @Mutation
    public saveSelectedAnnotation(annotationClassId: number): void {
        if (isNaN(this.selectedAnnotation)
            || this.selectedAnnotation >= this.annotations.length) {
            return;
        }
        // TODO: check annotation class index.
        this.annotations[this.selectedAnnotation].class =
            this.annotationClasses[annotationClassId];
        this.selectedAnnotation = NaN;
    }

    @Mutation
    public deleteSelectedAnnotation(): void {
        if (isNaN(this.selectedAnnotation)
            || this.selectedAnnotation >= this.annotations.length) {
            return;
        }
        this.annotations.splice(this.selectedAnnotation, 1);
        if (this.selectedAnnotation >= this.annotations.length) {
            this.selectedAnnotation = 0;
        }
        if (this.annotations.length === 0) {
            this.selectedAnnotation = NaN;
        }
    }

    @Mutation
    public select(id: number): void {
        if (
            !isNaN(id)
            && this.annotations.length > 0
            && id >= 0
            && id < this.annotations.length) {
            this.selectedAnnotation = id;
        }
    }

    @Mutation
    public selectPrevious(): void {
        if (this.annotations.length > 0) {
            if (isNaN(this.selectedAnnotation)
                || this.selectedAnnotation === 0) {
                this.selectedAnnotation = this.annotations.length - 1;
            } else {
                this.selectedAnnotation = this.selectedAnnotation - 1;
            }
        }
    }

    @Mutation
    public selectNext(): void {
        if (this.annotations.length > 0) {
            if (isNaN(this.selectedAnnotation)
                || this.selectedAnnotation === this.annotations.length - 1) {
                this.selectedAnnotation = 0;
            } else {
                this.selectedAnnotation = this.selectedAnnotation + 1;
            }
        }
    }

    @Mutation
    public updateRatio(imageHolder: HTMLElement): void {
        this.imageRatio.width = this.imageSize.width /
            imageHolder.clientWidth;
        this.imageRatio.height = this.imageSize.height /
            imageHolder.clientHeight;
        this.imageReverseRatio.width = 1 / this.imageRatio.width;
        this.imageReverseRatio.height = 1 / this.imageRatio.height;
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

    @Action
    public async fetchState(): Promise<void> {
        // TODO: Fetch annotation classes by API.
        this.context.commit('addAnnotationClass', {id: 0, label: 'Bottle'});
        this.context.commit('addAnnotationClass', {id: 1, label: 'Fragments'});
        this.context.commit('addAnnotationClass', {id: 2, label: 'Other'});
        // TODO: Fetch next image by API.
        this.context.commit(
            'loadImage',
            'http://stmarkclinton.org/wp-content/uploads/2017/08/summer-rocks-trees-river.jpg');
    }

    @Action
    public async postAnnotations(): Promise<void> {
        // TODO: Format annotations
        // TODO: post serialized annotations.
    }

}

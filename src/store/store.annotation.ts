/**
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import {Module, VuexModule, Mutation, Action} from 'vuex-module-decorators';

import axios from 'axios';
import Box from '@/models/geometry/box';
import Size from '@/models/geometry/size';
import Point from '@/models/geometry/point';
import {Annotation, AnnotationClass, ContextClass, PictureContext} from '@/models/annotation';

import store from './store';

@Module({
    name: 'annotation',
    store,
    dynamic: true,
    namespaced: true
})
export default class AnnotationStore extends VuexModule {

    /** */
        // Note: consider using more complex structure like id.
    public image: string = '';

    /** HTML <img> element used as image loader. */
    public imageLoader: HTMLImageElement | undefined;

    /** Boolean flag indicated if the current image is fully loaded. */
    public imageLoaded: boolean = false;

    /** Annotated image real size.  */
    public readonly imageSize: Size = {width: 0, height: 0};

    /** Applied image ratio to the annotation surface. */
    public readonly imageRatio: Size = {width: 1, height: 1};

    /** Reverse applied image ratio. */
    public readonly imageReverseRatio: Size = {width: 1, height: 1};

    /** List of user's drawn annotations. */
    public annotations: Annotation[] = [];

    public pictureContext: PictureContext = {
        environment: [],
        quality: '',
        pointOfView: ''
    };

    /** List of annotation classes available for the current image. */
    public annotationClasses: AnnotationClass[] = [];

    /** List of context classes available for the current image. */
    public contextEnvClasses: Array<ContextClass> = [];

    /** List of context classes  */
    public contextPovClasses: Array<ContextClass> = [
        {value: 'above', label: 'above'},
        {value: 'frontal', label: 'frontal'},
        {value: 'under', label: 'under'}];

    /** List of quality classes */
    public contextQualityClasses: Array<ContextClass> = [
        {value: 'pixelised', label: 'pixelised'},
        {value: 'ok', label: 'ok'},
        {value: 'bad', label: 'bad'}];

    /** Index of the currently selected annotation if any, NaN otherwise. */
    public selectedAnnotation: number = NaN;

    /** Index of class of the currently selected annotation class if any, NaN otherwise. */
    public selectedAnnotationClass: number = NaN;

    /** Current user cursor position (relative to real image size). */
    public readonly relativeCursor: Point = {x: 0, y: 0};

    /** Const to define http request base url. Possible to moove this part in a external file or class. */
    private HTTP = axios.create({
        url: 'http://localhost:443/',
    });

    /** Limit size for trash (in pixels) */
    public minTrashSize: number = 20; // todo : un-hardcode this.

    @Mutation
    public resetAnnotations(): void {
        this.selectedAnnotation = NaN;
        this.annotations = [];
    }

    @Mutation
    public resetPictureContext(): void {
        this.pictureContext.environment = [];
        this.pictureContext.quality = '';
        this.pictureContext.pointOfView = '';
    }


    @Mutation
    public loadImage(url: string | undefined): void {
        if (url) {
            const tokens: string[] = url.split('?');
            const seed: number = Date.now();
            const cacheless: string = `${tokens[0]}?${seed}`;
            this.imageLoaded = true;
            this.image = cacheless;
            if (this.imageLoader) {
                this.imageLoader.src = cacheless;
            }
        } else {
            console.log("ELSE");
            axios.defaults.baseURL = 'http://localhost:443';
            axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
            axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
            axios.defaults.headers.post['Accept'] = '*/*';
            let myUrl = '';
            axios.get('/images').then(function(response) {
                myUrl = response.data;
                console.log(response.data);
            });
            if (myUrl) {
                const src: string = myUrl;
                this.imageLoaded = false;
                this.image = src;
                console.log("myURl");
                if (this.imageLoader) {
                    console.log("imageLODER = true");
                    this.imageLoader.src = src;
                }
            }
        }
    }

    @Mutation
    public registerImageLoader(imageLoader: HTMLImageElement): void {
        console.log(imageLoader)
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
    public addEnvPictureContext(value: Array<string>): void {
        this.pictureContext.environment = value
    }

    @Mutation
    public addPovPictureContext(value: string): void {
        this.pictureContext.pointOfView = value
    }

    @Mutation
    public addQualityPictureContext(value: string): void {
        this.pictureContext.quality = value
    }

    @Mutation
    public addAnnotationClass(annotationClass: AnnotationClass): void {
        this.annotationClasses.push(annotationClass);
    }

    @Mutation
    public resetAnnotationClasses(): void {
        console.log('resetAnnotationClasses');
        this.annotationClasses = [];
    }

    @Mutation
    public addContextEnvClass(contextClass: ContextClass): void {
        this.contextEnvClasses.push(contextClass);
    }

    @Mutation
    public resetContextEnvClasses(): void {
        this.contextEnvClasses = [];
    }

    @Mutation
    public editAnnotationClass(edit: any): void {
        const id = edit.id;
        const annotationClassId = edit.annotationClassId;
        if (!isNaN(annotationClassId)) {
            this.annotations[id].class = this.annotationClasses[annotationClassId]
        } else {
            console.log('Annotation class is undefined ')
        }
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
        // this.selectedAnnotation = NaN;
        // this.selectedAnnotationClass = NaN ;

    }

    @Mutation
    public resetSelectedAnnotation(): void {
        this.selectedAnnotation = NaN;
        this.selectedAnnotationClass = NaN;
    }

    @Mutation
    public deleteSelectedAnnotation(): void {
        if (isNaN(this.selectedAnnotation)
            || this.selectedAnnotation >= this.annotations.length) {
            return;
        }
        this.selectedAnnotationClass = NaN;
        this.annotations.splice(this.selectedAnnotation, 1);
        if (this.selectedAnnotation >= this.annotations.length) {
            this.selectedAnnotation = 0;
        }
        if (this.annotations.length === 0) {
            this.selectedAnnotation = NaN;
        }
    }

    @Mutation
    public deleteAnnotation(selectedAnnotation: number): void {
        if (isNaN(selectedAnnotation)
            || selectedAnnotation >= this.annotations.length) {
            return;
        }
        this.annotations.splice(selectedAnnotation, 1);
        console.log('Delete annotation ' + selectedAnnotation)
    }

    @Mutation
    public select(id: number): void {
        if (
            !isNaN(id)
            && this.annotations.length > 0
            && id >= 0
            && id < this.annotations.length) {
            this.selectedAnnotation = id;
            let annotationClass = this.annotations[id].class;
            this.selectedAnnotationClass = annotationClass !== undefined ? annotationClass.id : NaN;
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
        // flush current annotation and env classes
        this.context.commit('resetAnnotationClasses');
        this.context.commit('resetContextEnvClasses');
        // TODO: Fetch annotation classes by API.
        this.context.commit('addAnnotationClass', {id: 0, label: 'Bottle'});
        this.context.commit('addAnnotationClass', {id: 1, label: 'Fragments'});
        this.context.commit('addAnnotationClass', {id: 2, label: 'Other'});

        // TODO: Fetch context classes by API.
        this.context.commit('addContextEnvClass', {value: 'nature', label: 'Nature'});
        this.context.commit('addContextEnvClass', {value: 'river', label: 'River'});
        this.context.commit('addContextEnvClass', {value: 'city', label: 'City'});
        this.context.commit('addContextEnvClass', {value: 'mountain', label: 'Mountain'});
        this.context.commit('addContextEnvClass', {value: 'forest', label: 'Forest'});
        this.context.commit('addContextEnvClass', {value: 'indoor', label: 'Indoor'});

        // TODO: Fetch next image by API.
        this.context.commit('loadImage');
         /*this.context.commit(
            'loadImage',
            'http://stmarkclinton.org/wp-content/uploads/2017/08/summer-rocks-trees-river.jpg'); */
    }

// 'https://www.fccnn.com/news/article885023.ece/alternates/BASE_LANDSCAPE/Michael%20Anderson%27s%20canoe%20near%20Red%20Wing%20during%20the%20Three%20Rivers%20Expedition%20in%20September%202017.%20A%20year%20later%2C%20the%20adventure%20continues.%20Photo%20by%20Michael%20Anderson'
    @Action
    public async postAnnotations(): Promise<void> {
        const post = {
            annotations: this.annotations, context:
            this.pictureContext
        };
        console.log(post)
        // TODO: Format annotations
        // TODO: post serialized annotations.
    }

}

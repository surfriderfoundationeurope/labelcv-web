/**
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

// eslint-disable-next-line no-unused-vars
import axios, { AxiosRequestConfig } from "axios";
// eslint-disable-next-line no-unused-vars,import/no-unresolved
import Box from "@/models/geometry/box";
// eslint-disable-next-line import/no-unresolved,no-unused-vars
import Size from "@/models/geometry/size";
// eslint-disable-next-line no-unused-vars,import/no-unresolved
import Point from "@/models/geometry/point";
import {
    // eslint-disable-next-line no-unused-vars
    Annotation,
    // eslint-disable-next-line no-unused-vars
    AnnotationClass,
    // eslint-disable-next-line no-unused-vars
    ContextClass,
    // eslint-disable-next-line no-unused-vars
    PictureContext,
    // eslint-disable-next-line no-unused-vars
    EnvContextClass
    // eslint-disable-next-line import/no-unresolved
} from "@/models/annotation";

// eslint-disable-next-line import/extensions
import store from "./store";

@Module({
    name: "annotation",
    store,
    dynamic: true,
    namespaced: true
})
export default class AnnotationStore extends VuexModule {
    /** */
    // Note: consider using more complex structure like id.
    public image: string = "";
    public imageId: string = "";
    public creatorId: string = "";

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

    public pictureContext: PictureContext = {
        environment: "",
        quality: "",
        pointOfView: ""
    };

    /** List of annotation classes available for the current image. */
    public annotationClasses: AnnotationClass[] = [];

    /** List of context classes available for the current image. */
    public contextEnvClasses: EnvContextClass = {
        selected: [],
        options: [
            { value: "urban", text: "Urban" },
            { value: "nature", text: "Nature" },
            { value: "river", text: "River" },
            { value: "beach", text: "Beach" },
            { value: "underwater", text: "Underwater" }
        ]
    };

    /** List of context classes  */
    public contextPovClasses: ContextClass = {
        selected: "",
        options: [
            { value: "side", text: "Side" },
            { value: "above", text: "Above" }
        ]
    };

    /** List of quality classes */
    public contextQualityClasses: ContextClass = {
        selected: "",
        options: [
            { value: "good", text: "Good" },
            { value: "medium", text: "Medium" },
            { value: "bad", text: "Bad" }
        ]
    };

    /** Index of the currently selected annotation if any, NaN otherwise. */
    public selectedAnnotation: number = NaN;

    /** Index of class of the currently selected annotation class if any, NaN otherwise. */
    public selectedAnnotationClass: number = NaN;

    /** Current user cursor position (relative to real image size). */
    public readonly relativeCursor: Point = { x: 0, y: 0 };

    /** Request config */
    public axiosRequestConfig: AxiosRequestConfig = {
        baseURL: "",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Access-Control-Allow-Origin": "*"
        }
    };

    /** Limit size for trash (in pixels) */
    public minTrashSize: number = 20; // todo : un-hardcode this.

    @Mutation
    public setURL(url: string): void {
        this.axiosRequestConfig.baseURL = url;
        // eslint-disable-next-line no-console
        console.log(`Successfuly set API URL to ${url}`);
    }

    @Mutation
    public resetAnnotations(): void {
        this.selectedAnnotation = NaN;
        this.annotations = [];
    }

    @Mutation
    public resetPictureContext(): void {
        this.pictureContext.environment = "";
        this.pictureContext.quality = "";
        this.pictureContext.pointOfView = "";
    }

    @Mutation
    public loadImage(url: string | undefined): void {
        if (url) {
            const tokens: string[] = url.split("?");
            const seed: number = Date.now();
            const cacheless: string = `${tokens[0]}?${seed}`;
            this.imageLoaded = true;
            this.image = cacheless;
            if (this.imageLoader) {
                this.imageLoader.src = cacheless;
            }
        } else {
            const self = this;
            console.log(this.axiosRequestConfig);
            axios
                .get("/images/random", this.axiosRequestConfig)
                .then(response => {
                    // console.log(response.data);
                    const data = response.data;
                    self.image = data.url;
                    self.imageId = data.imageId;
                    self.creatorId = data.creatorId;
                    self.imageLoaded = false;
                    if (self.imageLoader) {
                        self.imageLoader.src = data.url;
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    @Mutation
    public loadAnnotationClasses(): void {
        const self = this;
        axios
            .get("/images/trashtypes", this.axiosRequestConfig)
            .then(response => {
                self.annotationClasses = response.data;
                // self.annotationClasses.forEach((annotationClass: any)  => {
                //     annotationClass.id = annotationClass.id.toString()
                // }); // todo: ask Vincent to change type in back
                // console.log(self.annotationClasses);
            })
            .catch(error => {
                console.log(error);
            });
    }

    @Mutation
    public registerImageLoader(imageLoader: HTMLImageElement): void {
        imageLoader.onload = () => {
            this.imageLoaded = true;
            this.imageSize.width = imageLoader.naturalWidth;
            this.imageSize.height = imageLoader.naturalHeight;
            // Note: ensure ratio is updated once loaded.
            window.dispatchEvent(new Event("resize"));
        };
        this.imageLoader = imageLoader;
        if (this.image) {
            this.imageLoader.src = this.image;
        }
    }

    @Mutation
    public addAnnotation(box: Box): void {
        // TODO: Compare with size threshold (@see #12).
        this.selectedAnnotation = this.annotations.push({ box }) - 1;
    }

    @Mutation
    public addEnvPictureContext(value: string): void {
        this.pictureContext.environment = value;
    }

    @Mutation
    public addPovPictureContext(value: string): void {
        this.pictureContext.pointOfView = value;
    }

    @Mutation
    public addQualityPictureContext(value: string): void {
        this.pictureContext.quality = value;
    }

    @Mutation
    public resetAnnotationClasses(): void {
        // console.log('resetAnnotationClasses');
        this.annotationClasses = [];
    }

    @Mutation
    public editAnnotationClass({
        annotationIndex,
        annotationClass
    }: {
        annotationIndex: number;
        annotationClass: AnnotationClass;
    }): void {
        thxis.annotations[annotationIndex].class = annotationClass;
    }

    @Mutation
    public saveSelectedAnnotation(annotationClassId: number): void {
        if (
            isNaN(this.selectedAnnotation) ||
            this.selectedAnnotation >= this.annotations.length
        ) {
            return;
        }
        // TODO: check annotation class index.
        this.annotations[
            this.selectedAnnotation
        ].class = this.annotationClasses[annotationClassId];
    }

    @Mutation
    public resetSelectedAnnotation(): void {
        this.selectedAnnotation = NaN;
        this.selectedAnnotationClass = NaN;
    }

    @Mutation
    public deleteSelectedAnnotation(): void {
        if (
            isNaN(this.selectedAnnotation) ||
            this.selectedAnnotation >= this.annotations.length
        ) {
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
        if (
            isNaN(selectedAnnotation) ||
            selectedAnnotation >= this.annotations.length
        ) {
            return;
        }
        this.annotations.splice(selectedAnnotation, 1);
        console.log("Delete annotation " + selectedAnnotation);
    }

    @Mutation
    public select(id: number): void {
        if (
            !isNaN(id) &&
            this.annotations.length > 0 &&
            id >= 0 &&
            id < this.annotations.length
        ) {
            this.selectedAnnotation = id;
            const annotationClass = this.annotations[id].class;
            this.selectedAnnotationClass =
                annotationClass !== undefined ? annotationClass.id : NaN;
        }
    }

    @Mutation
    public updateRatio(imageHolder: HTMLElement): void {
        this.imageRatio.width = this.imageSize.width / imageHolder.clientWidth;
        this.imageRatio.height =
            this.imageSize.height / imageHolder.clientHeight;
        this.imageReverseRatio.width = 1 / this.imageRatio.width;
        this.imageReverseRatio.height = 1 / this.imageRatio.height;
    }

    @Mutation
    public updateRelativeCursor(offset: Point): void {
        if (
            offset.x >= 0 &&
            offset.y >= 0 &&
            offset.x <= this.imageSize.width &&
            offset.y <= this.imageSize.height
        ) {
            this.relativeCursor.x = Math.round(offset.x);
            this.relativeCursor.y = Math.round(offset.y);
        }
    }

    @Action
    public async fetchState(): Promise<void> {
        // Fetch next image by API.
        this.context.commit("loadImage");
        // Fetch annotation classes by API.
        this.context.commit("loadAnnotationClasses");
        /*this.context.commit(
           'loadImage',
           'http://stmarkclinton.org/wp-content/uploads/2017/08/summer-rocks-trees-river.jpg'); */
    }

    // tslint:disable-next-line:max-line-length
    // 'https://www.fccnn.com/news/article885023.ece/alternates/BASE_LANDSCAPE/Michael%20Anderson%27s%20canoe%20near%20Red%20Wing%20during%20the%20Three%20Rivers%20Expedition%20in%20September%202017.%20A%20year%20later%2C%20the%20adventure%20continues.%20Photo%20by%20Michael%20Anderson'
    @Action
    public postAnnotations(): void {
        const postImageLabel = {
            imageId: this.imageId,
            creatorId: this.creatorId,
            createdOn: "",
            filename: "",
            view: this.pictureContext.pointOfView,
            imgQuality: this.pictureContext.quality,
            context: this.pictureContext.environment,
            url: this.image,
            bbox: []
        };
        axios.post("/images/update", postImageLabel, this.axiosRequestConfig);

        this.annotations.forEach(async annotation => {
            // tslint:disable-next-line:no-shadowed-variable

            const postAnnotation = {
                id: "",
                creatorId: this.creatorId,
                createdOn: "",
                trashId:
                    annotation.class !== undefined ? annotation.class.id : -1,
                imageId: this.imageId,
                location_x: annotation.box.x,
                location_y: annotation.box.y,
                width: annotation.box.width,
                height: annotation.box.height
            };
            await axios.post(
                "/images/annotate",
                postAnnotation,
                this.axiosRequestConfig
            );
        });
        // console.log(post);
    }
}

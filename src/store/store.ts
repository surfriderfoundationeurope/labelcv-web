import Vue from "vue";
import Vuex from "vuex";
import axios, { AxiosRequestConfig } from "axios";
import {
    QualityValue,
    ViewPoint,
    EnvironmentValue,
    Size,
    Point,
    Annotation,
    AnnotationLabel,
    Box
} from "@/models";

Vue.use(Vuex);

const developmentImages = [
    "./images/tutorial/tuto-fragment.png",
    "./images/tutorial/tuto-beach.png",
    "./images/tutorial/tuto-bottle.png",
    "./images/tutorial/tuto-othher.png"
    // "https://thumbs.dreamstime.com/b/pollution-lake-fresh-water-plastic-trash-dirty-waste-beach-summer-day-beautiful-nature-peoplelessness-150318217.jpg",
    // "https://www.europarl.europa.eu/resources/library/images/20181008PHT15277/20181008PHT15277-cl.jpg"
]; // TODO : Should be fetch from API
const pickRandom = (array: string[]) =>
    array[Math.floor(Math.random() * array.length)];
const developmentAnnotationLabels: AnnotationLabel[] = [
    { id: 1, name: "bottle" },
    { id: 2, name: "paper" },
    { id: 3, name: "some super long trash name" }
]; // TODO : Should be fetch from API
const savedAuth = localStorage.getItem("auth");

type ContextSelections = {
    quality: QualityValue | null;
    viewPoint: ViewPoint | null;
    environment: EnvironmentValue | null;
};
export type State = {
    axiosRequestConfig?: AxiosRequestConfig;
    auth: {
        token?: string;
        expires?: string;
    };
    useAxios: boolean;
    contextSelections?: ContextSelections;
    image: {
        loader: HTMLImageElement | undefined;
        loaded: boolean;
        url?: string;
        creator?: string;
        id?: string;
        size: Size;
        ratio: Size;
        reverseRatio: Size;
        landscapeRatio: number;
    };

    boxOffset: Point;
    relativeCursor: Point;
    annotations: Annotation[];
    selectedBoxUid?: number;
    selectedAnnotationLabel?: AnnotationLabel;
    annotationLabels: AnnotationLabel[];
    minTrashSize: number;
};
export const initialState: State = {
    useAxios: false,
    auth: savedAuth ? JSON.parse(savedAuth) : {},
    image: {
        loader: undefined,
        loaded: false,
        size: { width: 1, height: 1 },
        ratio: { width: 1, height: 1 },
        reverseRatio: { width: 1, height: 1 },
        landscapeRatio: 1
    },

    boxOffset: { x: NaN, y: NaN },
    relativeCursor: { x: 0, y: 0 },

    annotations: [],
    annotationLabels: [],
    minTrashSize: 20 // Limit size for trash (in pixels) */
};

const mutations = {
    setAxiosRequestConfig(state: State, url: string) {
        state.axiosRequestConfig = {
            baseURL: url,
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "Access-Control-Allow-Origin": "*",
                Authorization: state.auth.token
                    ? `Bearer ${state.auth.token}`
                    : undefined
            }
        };
    },
    setContextSelections(state: State, contextSelections: ContextSelections) {
        state.contextSelections = contextSelections;
    },
    resetContextSelections(state: State) {
        state.contextSelections = undefined;
    },

    updateRatio(
        state: State,
        {
            actualImageWidth,
            actualImageHeight
        }: { actualImageWidth: number; actualImageHeight: number }
    ): void {
        state.image.ratio.width = state.image.size.width / actualImageWidth;
        state.image.ratio.height = state.image.size.height / actualImageHeight;
        state.image.reverseRatio.width = 1 / state.image.ratio.width;
        state.image.reverseRatio.height = 1 / state.image.ratio.height;
    },
    updateRelativeCursor(state: State, offset: Point): void {
        if (
            offset.x > 0 &&
            offset.y > 0 &&
            offset.x <= state.image.size.width &&
            offset.y <= state.image.size.height
        ) {
            state.relativeCursor.x = Math.round(offset.x);
            state.relativeCursor.y = Math.round(offset.y);
        }
    },
    updateBoxOffset(state: State, offset: Point): void {
        state.boxOffset.x = offset.x;
        state.boxOffset.y = offset.y;
    },
    addBox(state: State, box: Box): void {
        // We use Date.now() as a unique id
        const uid = Date.now();
        state.annotations.push({ box, uid: uid }) - 1;
        state.selectedBoxUid = uid;
    },
    resetAnnotations(state: State): void {
        state.annotations = [];
    },
    updateBoxAnnotationLabel(
        state: State,
        {
            boxUid,
            annotationLabel
        }: { boxUid: number; annotationLabel: AnnotationLabel }
    ): void {
        state.annotations = state.annotations.map(annotation => {
            return annotation.uid == boxUid
                ? { ...annotation, annotationLabel: annotationLabel }
                : annotation;
        });
    },
    selectAnnotation(state: State, boxUid: number): void {
        const annotation = state.annotations.find(
            annotation => annotation.uid == boxUid
        );
        if (annotation) {
            state.selectedBoxUid = boxUid;
            state.selectedAnnotationLabel = annotation.annotationLabel;
        }
    },
    deleteBox(state: State, boxUid: number): void {
        state.annotations = state.annotations.filter(
            annotatedTrash => annotatedTrash.uid != boxUid
        );
    },

    resetSelectedBox(state: State): void {
        state.selectedBoxUid = undefined;
        state.selectedAnnotationLabel = undefined;
    },
    loadImage(state: State): void {
        if (!state.useAxios) {
            console.log("[DEV] loadImage. ");
            state.image.url = pickRandom(developmentImages);
            state.image.loaded = false;
            if (state.image.loader) {
                state.image.loader.src = state.image.url;
            }
        } else {
            axios
                .get("/images/random", state.axiosRequestConfig)
                .then(response => {
                    const data = response.data;
                    state.image.url = data.url;
                    state.image.id = data.imageId;
                    state.image.creator = data.creatorId;
                    state.image.loaded = false;
                    if (state.image.loader) {
                        state.image.loader.src = data.url;
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    },
    loadAnnotationLabels(state: State): void {
        if (!state.useAxios) {
            console.log("[DEV] loadAnnotationLabels. ");
            state.annotationLabels = developmentAnnotationLabels;
        } else {
            axios
                .get("/images/trashtypes", state.axiosRequestConfig)
                .then(response => {
                    state.annotationLabels = response.data;
                    // TODO : Should we check the format ?
                })
                .catch(error => {
                    console.log(error);
                });
        }
    },

    registerImageLoader(state: State, imageLoader: HTMLImageElement): void {
        imageLoader.onload = () => {
            state.image.loaded = true;
            state.image.size.width = imageLoader.naturalWidth;
            state.image.size.height = imageLoader.naturalHeight;
            state.image.landscapeRatio =
                imageLoader.naturalWidth / imageLoader.naturalHeight;
            // Note: ensure ratio is updated once loaded.
            window.dispatchEvent(new Event("resize"));
        };
        state.image.loader = imageLoader;
        if (state.image.url) {
            state.image.loader.src = state.image.url;
        }
    },

    authenticate(
        state: State,
        payload: { token: string; expires: string }
    ): void {
        state.auth = payload;
        localStorage.setItem("auth", JSON.stringify(payload));
        if (state.axiosRequestConfig) {
            state.axiosRequestConfig.headers[
                "Authorization"
            ] = `Bearer ${payload.token}`;
        }
    },

    logout(state: State): void {
        state.auth = {};
        localStorage.removeItem("auth");
        if (state.axiosRequestConfig) {
            state.axiosRequestConfig.headers["Authorization"] = undefined;
        }
    }
};

type WithUid = { uid: number };
const findByUid = <T extends WithUid>(array: T[], uid: number) =>
    array.find(element => element.uid == uid);

const store = new Vuex.Store({
    state: initialState,
    mutations: mutations,
    getters: {
        getAxiosRequestConfig: state => state.axiosRequestConfig,
        isLoggedIn: state => !!(state.auth && state.auth.token),
        getAnnotationsWithLabel: state => {
            return state.annotations.filter(
                annotation => !!annotation.annotationLabel
            );
        },
        getAnnotationByUid: (
            state: State
        ): ((uid: number) => Annotation | undefined) => {
            return uid => findByUid(state.annotations, uid);
        },
        numberOfAnnotations: state => {
            return state.annotations.filter(
                annotation => !!annotation.annotationLabel
            ).length;
        },
        getIndexByUid: state => (uid: number) =>
            state.annotations.findIndex(
                annotatedTrash => annotatedTrash.uid == uid
            )
    },
    actions: {
        async fetchState(): Promise<void> {
            this.commit("loadImage");
            this.commit("loadAnnotationLabels");
        },
        async setUseAxiosIfApiReady(): Promise<void> {
            if (!this.state.axiosRequestConfig) {
                this.state.useAxios = false;
            }
            axios
                .get("/images/status", this.state.axiosRequestConfig)
                .then(response => {
                    const statusOK = response.data;
                    if (statusOK) {
                        this.state.useAxios = true;
                    } else {
                        this.state.useAxios = false;
                    }
                })
                .catch(() => {
                    console.log(
                        "API cannot be reached.",
                        "\nFall back to development",
                        "mode (with default images and trash-types)."
                    );
                    this.state.useAxios = false;
                });
        },
        async postAnnotationsAndContext(): Promise<void> {
            const postImageContext = {
                imageId: this.state.image.id,
                creatorId: this.state.image.creator,
                createdOn: "",
                filename: "",
                view: this.state.contextSelections?.viewPoint,
                imgQuality: this.state.contextSelections?.quality,
                context: this.state.contextSelections?.environment,
                url: this.state.image.url,
                bbox: []
            };
            if (!this.state.axiosRequestConfig) {
                console.log("[DEV] post image context : ", postImageContext);
            } else {
                axios.post(
                    "/images/update",
                    postImageContext,
                    this.state.axiosRequestConfig
                );
            }

            this.getters.getAnnotationsWithLabel.forEach(
                async (
                    annotation: Annotation & {
                        annotationLabel: AnnotationLabel;
                    }
                ) => {
                    const postAnnotation = {
                        id: "",
                        creatorId: this.state.image.creator,
                        createdOn: "",
                        trashId: annotation.annotationLabel.id,
                        imageId: this.state.image.id,
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        location_x: annotation.box.x,
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        location_y: annotation.box.y,
                        width: Math.round(annotation.box.width),
                        height: Math.round(annotation.box.height)
                    };
                    if (!this.state.axiosRequestConfig) {
                        console.log("[DEV] post annotation : ", postAnnotation);
                    } else {
                        await axios.post(
                            "/images/annotate",
                            postAnnotation,
                            this.state.axiosRequestConfig
                        );
                    }
                }
            );
        },
        async configurateAPI(): Promise<void> {
            axios
                .get("config.prod.json")
                .then((response: { data: { url: string } }) => {
                    this.commit("setAxiosRequestConfig", response.data.url);
                    this.state.useAxios = true;
                })
                .catch(prodError => {
                    console.log(prodError);
                    axios
                        .get("config.dev.json")
                        .then((response: { data: { url: string } }) => {
                            this.commit(
                                "setAxiosRequestConfig",
                                response.data.url
                            );
                            this.dispatch("setUseAxiosIfApiReady");
                        })
                        .catch(error => {
                            console.log(error);
                            // In dev mode, two behavior : Use API if ready, else use default images and trash-types.
                            this.state.useAxios = false;
                        });
                })
                .catch(devError => {
                    console.log(devError);
                });
        },
        async login(context, credentials): Promise<void> {
            console.log("login ~ credentials", credentials);
            return axios.post(
                "/login",
                credentials,
                this.state.axiosRequestConfig
            );
        }
    },
    modules: {}
});

export { store, mutations };

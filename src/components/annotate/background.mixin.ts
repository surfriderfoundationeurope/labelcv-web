/**
 * A BackgroundImageMixin provides background image differed
 * loading combiend with ResizableElement features.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */
import { Mixin } from 'vue-mixin-decorator';

import ResizableElementMixin from './resizable.mixin';

@Mixin
export default class BackgroundImageMixin extends ResizableElementMixin {

    /** Boolean flag indicating if the image is ready. */
    public imageReady: Boolean = false;

    /** HTMLImageElement used as loader for the image.  */
    private imageLoader?: HTMLImageElement;

    /**
     * Load the image denoted to the given url through
     * the internal mounted image loader if any.
     *
     * Note: cacheless option.
     *
     * @param url URL of the image to load.
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
     * Register background image loader element.
     *
     * Note: should be used after element is mounted from 
     * #onBackgroundElementMounted() method.
     *
     * @param loader Image loader element to be mounted.
     */
    protected onBackgroundLoaderReady(loader: HTMLImageElement): void {
        this.imageLoader = loader;
        this.imageLoader.onload = this.onBackgroundImageLoad;
        // Note: force reload to ensure onload callback is used.
        this.loadImage(this.imageLoader.src);        
    }

    /**
     * Callback method used once a target background image is loaded.
     *
     * Note: consider rename for prevent merge conflict.
     */
    protected onBackgroundImageLoad(): void {
        if (this.imageLoader) {
            const loader = this.imageLoader;
            this.withResizableElement((resizableElement) => {
                resizableElement.size.width = loader.naturalWidth;
                resizableElement.size.height = loader.naturalHeight;
                this.applyBackground();
            });
            this.imageReady = true;    
        }
    }

    /**
     * Apply image loaded from image loader as background
     * to the internal resizable element.
     */
    protected applyBackground(): void {
        if (this.imageLoader) {
            const url = this.imageLoader.src;
            this.withResizableElement((resizableElement) => {
                const style = resizableElement.element.style;
                style.backgroundImage = `url('${url}')`;
                // TODO: Consider parameter this with cropping / positionning.
                style.backgroundRepeat = 'no-repeat';
                style.backgroundPosition = '0 0';
                style.backgroundSize = '100% 100% !important';
            });
        }
    }

};

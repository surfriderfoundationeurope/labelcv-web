/**
 * ImageDescriptor implementation for local file upload.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import ImageDescriptor from './image.descriptor';

export default class URLImageDescriptor implements ImageDescriptor {

    /**
     * Static factory methods for creating a collection of
     * descriptors from a given collection of URL.
     *
     * @param urls 
     */
    public static fromURLs(urls: string[]): URLImageDescriptor[] {
        return urls
            .map((url) => new URLImageDescriptor(url));
    }

    /** Image file URL. */
    public descriptor: string;

    /**
     * Default constructor.
     *
     * @param url Image file url..
     */
    constructor(url: string) {
        this.descriptor = url;
    }

    /** @inheritdoc */
    public async getImageURI() {
        return this.descriptor;
    }

}

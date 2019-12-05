/**
 * A simple interface for modeling image descriptor. Such image
 * descriptor represents an image from a target Provider.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

export default interface ImageDescriptor {

    /** Internal descriptor property. */
    descriptor: any;

    /**
     * Retrieves and returns an image URI.
     *
     * @returns Image URI.
     */
    getImageURI(): Promise<string>;

}

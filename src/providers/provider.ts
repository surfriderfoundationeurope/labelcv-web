/**
 * This modules provides abstraction for modeling image Provider.
 *
 * An image Provider is a storage provider to retrieve image from
 * in order to upload them for labelling.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

/**
 * A simple interface for modeling image descriptor. Such image
 * descriptor represents an image from a target Provider.
 */
interface ImageDescriptor {

    /** Internal descriptor property. */
    descriptor: any;

    /**
     * Retrieves and returns an image URI.
     *
     * @returns Image URI.
     */
    getImageURI(): Promise<string>;

}

/**
 * Interface that represents an image provider.
 * Such provider object aims to allow user to select
 * image(s) in order to process them from a target
 * datasource.
 */
interface ImageProvider<D extends ImageDescriptor> {

    /**
     * Trigger image selection for the given provider and returns
     * user selection as a list of associated ImageDescriptor.
     *
     * @param container Target DOM container to eventually mount component into.
     * @returns List of selected images's descriptor.
     */
    getImages(container: string): Promise<D[]>;

}

export {
    ImageDescriptor,
    ImageProvider,
};

/**
 * Interface that represents an image provider.
 * Such provider object aims to allow user to select
 * image(s) in order to process them from a target
 * datasource.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import ImageDescriptor from './image.descriptor';

export default interface ImageProvider<D extends ImageDescriptor> {

    /**
     * Trigger image selection for the given provider and returns
     * user selection as a list of associated ImageDescriptor.
     *
     * @returns List of selected images's descriptor.
     */
    getImages(): Promise<D[]>;

    /**
     * Register this image provider to the DOM node denoted
     * by the given container identifier if needed.
     *
     * @param container Target DOM container to eventually mount component into.
     */
    register(container: string): void;

}

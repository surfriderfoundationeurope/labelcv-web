/**
 * Image provider for retrieving image from Dropbox.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import ImageProvider from './image.provider';
import URLImageDescriptor from '../descriptor/image.descriptor.url';
import SUPPORTED_EXTENSIONS from '../image.supported';

export default class DropboxImageProvider implements ImageProvider<URLImageDescriptor> {

    /** @inheritdoc */
    public async getImages(): Promise<URLImageDescriptor[]>  {
        const files = await new Promise<string[]>((resolve, _) => {
            // TODO: Dropbox injection.
            // Dropbox.choose({
            //    success: resolve,
            //    cancel: () => resolve(),
            //    linkType: "preview",
            //    extensions: SUPPORTED_EXTENSIONS,
            //    folderselect: false,
            //    sizeLimit: 102400000,
            // });
        });
        return URLImageDescriptor.fromURLs(files);
    }

    /** @inheritdoc */
    public register(container: string): void {
        // TODO: Implements.
    }

}

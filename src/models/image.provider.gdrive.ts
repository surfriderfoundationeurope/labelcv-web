/**
 * Image provider for retrieving image from Google Drive.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import ImageProvider from './image.provider';
import URLImageDescriptor from './image.descriptor.url';
import SUPPORTED_EXTENSIONS from './image.supported';

export default class GoogleDriveImageProvider implements ImageProvider<URLImageDescriptor> {

    /** @inheritdoc */
    public async getImages(container: string)  {
        // TODO: implements.
        return [];
    }

}




/**
 * Image provider for retrieving image from Google Drive.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import ImageProvider from './image.provider';
import URLImageDescriptor from '../descriptor/image.descriptor.url';
import SUPPORTED_EXTENSIONS from '../image.supported';

export default class GoogleDriveImageProvider implements ImageProvider<URLImageDescriptor> {

    /** @inheritdoc */
    public async getImages(): Promise<URLImageDescriptor[]>  {
        // TODO: implements.
        return [];
    }

    /** @inheritdoc */
    public register(container: string): void {
        // TODO: Implements.
    }

}




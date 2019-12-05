/**
 * Empty image provider.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import {ImageDescriptor, ImageProvider} from './provider';

export default class DisabledImageProvider implements ImageProvider<ImageDescriptor> {

    /** @inheritdoc */
    public async getImages(container: string)  {
        alert('Not supported yet');
        return [];
    }

}

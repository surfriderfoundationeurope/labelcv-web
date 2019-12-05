/**
 * ImageDescriptor implementation for local file upload.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import {ImageDescriptor, ImageProvider} from './provider';
import FileInput from '../components/fileinput';
import LocalImageDescriptor from './local.descriptor';

export default class LocalImageProvider implements ImageProvider<LocalImageDescriptor> {

    /** @inheritdoc */
    public async getImages(container: string)  {
        const files = await new Promise<Blob[]>((resolve, _) => {
            const holder = new FileInput();
            holder.resolve = resolve;
            holder.$mount(container);
        });
        const descriptors = new Array<ImageDescriptor>();
        for (const file of files) {
            descriptors.push(new LocalImageDescriptor(file));
        }
        return descriptors;
    }

}

/**
 * Image provider for retrieving image from local disk.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import ImageProvider from './image.provider';
import BlobImageDescriptor from '../descriptor/image.descriptor.blob';

import FileInput from '../../../components/upload/fileinput';

export default class LocalImageProvider implements ImageProvider<BlobImageDescriptor> {

    /** Target hidden Vue component we proxy to get file inputs. */
    private input: FileInput;

    /**
     * Default constructor.
     * Initialize target input component.
     */
    constructor() {
        this.input = new FileInput();
    }

    /** @inheritdoc */
    public async getImages()  {
        const blobs = await new Promise<Blob[]>((resolve, _) => {
            this.input.getFiles(resolve);
        });
        return BlobImageDescriptor.fromBlobs(blobs);
    }

    /** @inheritdoc */
    public register(container: string): void {
        this.input.$mount(container);
    }

}

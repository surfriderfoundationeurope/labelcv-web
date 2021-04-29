/**
 * ImageDescriptor implementation for local file upload.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import ImageDescriptor from './image.descriptor';

export default class BlobImageDescriptor implements ImageDescriptor {

    /**
     * Static factory methods for creating a collection of
     * descriptors from a given collection of blob.
     *
     * @param blobs List of blobs to cast into a list of descriptors.
     */
    public static fromBlobs(blobs: Blob[]): BlobImageDescriptor[] {
        return blobs
            .map((blob) => new BlobImageDescriptor(blob));
    }

    /** Local file as <input> value. */
    public descriptor: Blob;

    /**
     * Default constructor.
     *
     * @param file File input value.
     */
    constructor(file: Blob) {
        this.descriptor = file;
    }

    /** @inheritdoc */
    public async getImageURI() {
        return await new Promise<string>((resolve, _) => {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent) => {
                const target = e.target as FileReader;
                if (target) {
                    const result = target.result;
                    if (result) {
                        resolve(result.toString());
                    }
                }
            };
            reader.readAsDataURL(this.descriptor);
        });
    }

}

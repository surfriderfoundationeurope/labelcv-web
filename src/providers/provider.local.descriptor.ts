/**
 * ImageDescriptor implementation for local file upload.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import { ImageDescriptor } from './provider';

export default class LocalImageDescriptor implements ImageDescriptor {

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
                const target = e.target;
                if (target) {
                    // TODO: figure out how to solve the missing property.
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

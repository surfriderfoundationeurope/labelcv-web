/**
 * A cheesy custom component that aims to be silently
 * injected into DOM in order to trigger file dialog.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import SUPPORTED_EXTENSIONS from '../models/image.supported';

@Component({})
export default class FileInput extends Vue {

    /** Promise issued resolve function. */
    public resolve?: (value?: Blob[] | PromiseLike<Blob[]> | undefined) => void;

    /** Rendering method. */
    protected render(createElement: any): VNode {
        return createElement('input', {
            on: {change: this.onFileChange},
            ref: 'input',
            attrs: {
                type: 'file',
                multiple: true,
                accept: SUPPORTED_EXTENSIONS.join(','),
            },
            style: {display: 'none'},
        });
    }

    /** Mount point, trigger file dialog. */
    public getFiles(resolve: (value?: Blob[] | PromiseLike<Blob[]> | undefined) => void) {
        this.resolve = resolve;
        const input = this.$refs.input;
        if (input instanceof HTMLElement) {
            input.click();
        }
    }

    /** File input listener. */
    private onFileChange(e: any) {
        if (this.resolve) {
            this.resolve(e.target.files);
            this.resolve = undefined;
        }
    }

}

// see : https://medium.com/practicaldesign/vue-dropbox-chooser-cb4431aa2c5f
// see : https://medium.com/practicaldesign/google-picker-with-vue-2a39de7f36e


import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

@Component({})
export default class FileInput extends Vue {

    /** */
    public resolve?: (value?: Blob[] | PromiseLike<Blob[]> | undefined) => void;

    /** */
    public apiKey?: string;

    /** Rendering method. */
    protected render(createElement: any): VNode {
        return createElement('script', {
            attrs: {
                id: 'dropboxjs',
                src: 'https://www.dropbox.com/static/api/2/dropins.js',
                'data-app-key': this.apiKey,
            },
        });
    }

}

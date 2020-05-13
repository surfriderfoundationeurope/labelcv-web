/**
 * To be documented.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import Box from './geometry/box';

interface AnnotationClass {
    id: number;
    label: string;
}

interface ContextClass {
    value: string;
    label: string;
}

interface PictureContext {
    environment: Array<string>;
    quality: string;
    pointOfView: string;
}

interface Annotation {
    box: Box;
    class?: AnnotationClass;
}

export {
    AnnotationClass,
    Annotation,
    ContextClass,
    PictureContext
};

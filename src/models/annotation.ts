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

interface Annotation {
    box: Box;
    class?: AnnotationClass;
}

export {
    AnnotationClass,
    Annotation,
};

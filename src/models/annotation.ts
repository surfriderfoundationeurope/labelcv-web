/**
 * To be documented.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import Box from './geometry/box';

interface AnnotationClass {
  id: number;
  name: string;
}

interface EnvContextClass {
  selected: string[];
  options: object[];
}

interface ContextClass {
  selected: string;
  options: object[];
}

interface PictureContext {
  environment: string;
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
  PictureContext,
  EnvContextClass,
};

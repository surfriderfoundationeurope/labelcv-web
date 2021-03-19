import { Box } from "./geometry";

export type AnnotationLabel = {
    id: number;
    name: string;
};

export type Annotation = {
    uid: number;
    box: Box;
    annotationLabel?: AnnotationLabel;
};

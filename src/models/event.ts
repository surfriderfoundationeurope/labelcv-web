/**
 * Enumeration of supported event through this application.
 * 
 * @author Felix Voituret <oss@voituret.fr>
 */

 import Point from './geometry/point';

 enum Event {
    UPLOADING,
    UPLOADED,
    MOVE_SURFACE,
    MOVE_BOX,
}; 

interface BoundingBoxMoveEvent {
  box: string;
  x: number;
  y: number;
}

export {
    Event,
    BoundingBoxMoveEvent,
};

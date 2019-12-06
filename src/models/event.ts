/**
 * Enumeration of supported event through this application.
 * 
 * @author Felix Voituret <oss@voituret.fr>
 */

 enum Event {
    UPLOADING,
    UPLOADED,
    ENTER_BOX,
    LEAVE_BOX,
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

/**
 * Enumeration of supported event through this application.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

enum Event {
    UPLOADING,
    UPLOADED,
    MOVE_SURFACE,
    MOVE_BOX,
    REMOVE_BOX,
    SELECT_BOX,
    RESET_ANNOTATION,
    VALIDATE_ANNOTATION,
};

export {
    Event,
};

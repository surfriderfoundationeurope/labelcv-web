/**
 * Set of interface for event support.
 * 
 * @author Felix Voituret <oss@voituret.fr>
 */

import { OffsetEventListener } from '@/models/geometry/listeners';

interface ResizedMoveEventSupport {

    /**
     * Add the given resized move event listener.
     *
     * @param listener Listener to add.
     */
    addResizedMoveEventListener(listener: OffsetEventListener): void;

}

export {
    ResizedMoveEventSupport,
};

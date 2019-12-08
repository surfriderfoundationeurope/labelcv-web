/**
 * Set of interface for event support.
 * 
 * @author Felix Voituret <oss@voituret.fr>
 */

import {
    OffsetEventListener,
    RatioEventListener } from '@/models/geometry/listeners';
import ResizableElement from './resizable.element';

interface ResizedEventSupport {

    addResizedEventListener(listener: RatioEventListener): void;

}

interface ResizedMoveEventSupport {

    /**
     * Add the given resized move event listener.
     *
     * @param listener Listener to add.
     */
    addResizedMoveEventListener(listener: OffsetEventListener): void;

}

interface ResizedChildSupport {

    /**
     * 
     * @param child 
     */
    addChild(child: ResizableElement | HTMLElement): void;

    /**
     * 
     */
    removeChild(child: ResizableElement | HTMLElement): void;

}

export {
    RatioEventListener,
    ResizedEventSupport,
    ResizedChildSupport,
    ResizedMoveEventSupport,
};

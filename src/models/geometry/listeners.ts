/**
 * Set of listener interfaces.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import Point from './point';

type OffsetEventListener = (offset: Point) => void;

export {
    OffsetEventListener,
};

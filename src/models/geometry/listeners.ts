/**
 * Set of listener interfaces.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import Point from './point';
import Size from './size';

type OffsetEventListener = (offset: Point) => void;
type RatioEventListener = (ratio: Size) => void;

export {
    OffsetEventListener,
    RatioEventListener,
};

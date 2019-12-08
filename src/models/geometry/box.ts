/**
 * Bounding box interface.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import Point from './point';
import Size from './size';

export default interface Box extends Point, Size {};

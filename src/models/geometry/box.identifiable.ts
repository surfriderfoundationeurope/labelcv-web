/**
 * Id based box interface.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import Box from './box';

export default interface IdentifiableBox {
    id: string;
    data: Box;
};

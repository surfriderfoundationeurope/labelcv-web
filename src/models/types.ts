/**
 * Point and bounding box interface.
 * 
 * @author Felix Voituret <oss@voituret.fr>
 */

interface Point {
    x: number;
    y: number;
}

interface Box extends Point {
    width: number;
    height: number;
}

interface IdentifiableBox {
    id: string;
    data: Box;
}

export {
    Point,
    Box,
    IdentifiableBox,
};

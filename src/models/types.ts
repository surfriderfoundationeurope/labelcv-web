/**
 * Point and bounding box interface.
 * 
 * @author Felix Voituret <oss@voituret.fr>
 */

interface Point {
    x: number;
    y: number;
}

interface Size {
    width: number;
    height: number;
}

interface Box extends Point, Size {}

interface IdentifiableBox {
    id: string;
    data: Box;
}

export {
    Box,
    IdentifiableBox,
    Point,
    Size,
};

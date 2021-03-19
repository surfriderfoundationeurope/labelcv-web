import { mutations, initialState } from "../../store/store";

const { deleteBox } = mutations;
describe("delete box", () => {
    const someBox = { x: 0, y: 1, width: 2, height: 2 };

    it("delete box when only one", () => {
        const state = {
            ...initialState,
            annotations: [
                { box: someBox, trashKind: { id: 1, name: "bottle" }, uid: 34 }
            ]
        };
        deleteBox(state, 0);
        expect(state.annotations).toEqual([]);
    });
    it("delete box when multiple", () => {
        const state = {
            ...initialState,
            annotations: [
                { uid: 1, box: someBox, trashKind: { id: 1, name: "bottle" } },
                { uid: 2, box: someBox, trashKind: { id: 2, name: "paper" } },
                { uid: 3, box: someBox, trashKind: { id: 5, name: "can" } }
            ]
        };
        deleteBox(state, 0);
        expect(state.annotations).toEqual([
            { uid: 2, box: someBox, trashKind: { id: 2, name: "paper" } },
            { uid: 3, box: someBox, trashKind: { id: 5, name: "can" } }
        ]);
    });
});

export type QualityValue = "good" | "medium" | "bad";
export type EnvironmentValue =
    | "urban"
    | "nature"
    | "river"
    | "beach"
    | "underwater";

export type ViewPoint = "side" | "above";

type RadioOptions<T extends string> = { value: T; text: string }[];

export const viewPointOptions: RadioOptions<ViewPoint> = [
    { value: "side", text: "Side" },
    { value: "above", text: "Above" }
];

export const environmentOptions: RadioOptions<EnvironmentValue> = [
    { value: "urban", text: "Urban" },
    { value: "nature", text: "Nature" },
    { value: "river", text: "River" },
    { value: "beach", text: "Beach" },
    { value: "underwater", text: "Underwater" }
];

export const qualityOptions: RadioOptions<QualityValue> = [
    { value: "good", text: "Good" },
    { value: "medium", text: "Medium" },
    { value: "bad", text: "Bad" }
];

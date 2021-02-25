export enum CategoryColor {
  BLACK = "#000000",
  RED = "#FF0000",
  GREEN = "#00FF00",
  BLU = "#0000FF",
  GRAY = "#888888",
  OLIVE = "#888800",
  CYAN = "#007788",
  PURPLE = "#770088",
}
export type Category = {
  id: number;
  name: string;
  color: CategoryColor;
};
export type CategoryWithoutId = Omit<Category, "id">;

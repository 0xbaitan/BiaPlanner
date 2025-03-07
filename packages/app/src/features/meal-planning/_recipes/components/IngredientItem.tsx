import { IRecipeIngredient } from "@biaplanner/shared";

export type IngredientItemProps = {
  ingredient: IRecipeIngredient;
  index: number;
};
export default function IngredientItem(props: IngredientItemProps) {
  const { ingredient, index } = props;
  return (
    <div>
      <span>{index}</span>
      {ingredient.title}
      {ingredient.measurement?.magnitude}
      {ingredient.measurement?.unit}
      {ingredient.productCategories.map((category) => category.name).join(", ")}
    </div>
  );
}

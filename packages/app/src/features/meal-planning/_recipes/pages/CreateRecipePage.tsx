import RecipeForm from "../components/RecipeForm";

export default function CreateRecipePage() {
  return (
    <div>
      <RecipeForm onSubmit={(values) => console.log(values)} />
    </div>
  );
}

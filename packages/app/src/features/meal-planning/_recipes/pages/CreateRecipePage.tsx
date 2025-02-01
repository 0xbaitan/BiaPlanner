import { ICreateRecipeDto } from "@biaplanner/shared";
import RecipeForm from "../components/RecipeForm";
import { useCreateRecipeMutation } from "@/apis/RecipeApi";

export default function CreateRecipePage() {
  const [createRecipeMutation, { isLoading, isError, isSuccess }] = useCreateRecipeMutation();
  return (
    <div>
      <h1>Create Recipe</h1>

      {isLoading && <div>Loading...</div>}

      {isError && <div>Error</div>}

      {isSuccess && <div>Recipe created successfully</div>}
      <RecipeForm
        type="create"
        onSubmit={async (values) => {
          await createRecipeMutation(values as ICreateRecipeDto);
        }}
      />
    </div>
  );
}

import { Public } from '@/features/user-info/authentication/public.decorator';
import { Controller, Get, Inject } from '@nestjs/common';
import { RecipeSuggestionsService } from './suggestions.recipe.service';

@Controller('/meal-plan/recipe/suggestions')
export class RecipeSuggestionsController {
  constructor(
    @Inject(RecipeSuggestionsService)
    private readonly recipeSuggestionsService: RecipeSuggestionsService,
  ) {}

  @Public()
  @Get('/')
  async find() {
    return this.recipeSuggestionsService.computeRecipeSuggestions('1');
  }
}

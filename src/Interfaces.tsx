export interface Ingredient{
    ingredientName: string;
    ingredientAmount: string;
}

export interface Recipe {
    id?: string;
    recipeName: string;
    userOwner?: string;
    ingredients: Ingredient[];
    instructions: string[];
    recipeTag?: RecipeTag;
    description?: string;
    image?: string;
}

export enum RecipeTag{
    Breakfast,
    Lunch,
    Dinner,
    Meal,
    Snack,
    Drink,
    Dessert
}

export interface User{
    firstName: string;
    lastName: string;
    username: string;
}

export enum EditType{
	Create,
	Edit
}

export interface IEdit{
	editType: EditType
}

// @ts-ignore
export interface SyncLocalWebComponent extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
    data?: string; //MunchData; // Where munch data is the type of data that needs to be stored in local storage
}
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'data-sync': SyncLocalWebComponent;
        }
    }
}

export type Dinner = {
    date: Date,
    guests: Array<MealPlan>
}

export type MealPlan = {
    eater: Eater,
    meal: Meal,
    rating?: number
}

export type Eater = {
    name: string,
}

export type Meal = {
    name: string,
}

export type MealIngredients = {
    meal: Meal,
    ingredients: Array<IngredientQty>
}

export type IngredientQty = {
    ingredient: Ingredient,
    qty: number,
    unit?: string
}

export type Ingredient = {
    name: string
}

export type MunchData = {
    dinners: Array<Dinner>,
    mealIngredients: Array<MealIngredients>,
    selectedMeal: string,
    selectedDateIndex: number,
    ingredients: Array<IngredientQty>
}

export const MUNCH = 'munch';
export const MUNCH_BAK = 'munch-bak';
export const VERSIONS_STAMP = 'versions-stamp';
export const API_KEY = 'API_KEY';
export const MEAL_INGREDIENTS = 'meals';
export const SELECTED_MEAL = 'selected-meal';
export const SELECTED_DATE_INDEX = 'selected-date-index';
export const INGREDIENTS = 'ingredients';
export const DefaultIngredients = [{ ingredient: { name: '' }, qty: 1 }] as Array<IngredientQty>;

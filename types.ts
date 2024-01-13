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
    ingredients?: Array<Ingredient>
}

export type Ingredient = {
    name: string
}

export const MUNCH = 'munch';
export const SELECTED = 'selected-menu';
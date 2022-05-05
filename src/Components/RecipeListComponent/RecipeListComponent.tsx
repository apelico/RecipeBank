import React, { useState } from 'react'
import { Recipe } from '../../Interfaces'
import { ListGroup, Tabs, Tab, Modal } from 'react-bootstrap';

interface IRecipeList {
	recipes: Recipe[]
	SelectRecipe: (selectedIndex: number) => void
}

export default function RecipeListComponent({ recipes, SelectRecipe }: IRecipeList) {
	const [recipeIndex, setRecipeIndex] = useState<number>(0)

	function RenderRecipeList() {
		return (
			<ListGroup>
				{
					recipes.map((r, index) => {
						return (
							<ListGroup.Item action onClick={e => { setRecipeIndex(index); SelectRecipe(index) }} className={`${index == recipeIndex ? 'active' : ''} recipe-snippet`} key={index}>
								{r.recipeName}
							</ListGroup.Item>
						)
					})
				}
			</ListGroup>
		)
	}

	return (
		<>
			{RenderRecipeList()}
		</>
	)
}

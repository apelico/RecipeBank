import './RecipeComponent.css'
import { Recipe } from '../../Interfaces'
import { NavLink } from 'react-router-dom';
import { useContext, useState } from 'react';
import { userContext } from '../../Context'

import { ListGroup, Modal } from 'react-bootstrap';

interface IRecipe {
	recipe: Recipe
}

export default function RecipeComponent({ recipe }: IRecipe) {
	const { username } = useContext(userContext)

	if (recipe == undefined) return <></>;

	const ShowEditButton = () => {
		if (username == recipe.userOwner) {
			return <>
				<NavLink to={`/users/${recipe.userOwner}/${recipe.id}/edit`}>Edit</NavLink>
				<br></br>
			</>
		}

		return <></>
	}

	function RenderIngredients() {
		return (
			<ListGroup>
				{
					recipe.ingredients.map((ingredient, index) => {
						return (
							<ListGroup.Item key={index}>
								<input type='checkbox'></input>
								{" "}{ingredient.ingredientAmount} {ingredient.ingredientName}
							</ListGroup.Item>
						)
					})
				}
			</ListGroup>
		)
	}

	function RenderInstructions() {
		return (
			<ListGroup as='ol' numbered>
				{
					recipe.instructions.map((instruction, index) => {
						return (
							<ListGroup.Item as='li' key={index}>{instruction}</ListGroup.Item>
						)
					})
				}
			</ListGroup>
		)
	}

	function RenderImage(image: string) {
		if (image === "") return

		return (
			<Modal.Dialog>
				<img className='recipe-image' src={image} />
			</Modal.Dialog>
		)
	}

	return (
		<div>
			<Modal.Dialog>
				<Modal.Header>
					<Modal.Title>{recipe.recipeName}</Modal.Title> <Modal.Title><span className='recipe-owner'>by: <NavLink to={`/users/${recipe.userOwner}`}>{recipe.userOwner}</NavLink></span></Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ShowEditButton />
					<NavLink to={`/users/${recipe.userOwner}/${recipe.id}`}>View Recipe Link</NavLink>
				</Modal.Body>
			</Modal.Dialog>

			{RenderImage(recipe.image || "")}

			<Modal.Dialog>
				<Modal.Header>
					<Modal.Title>Ingredients</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					{RenderIngredients()}
				</Modal.Body>
			</Modal.Dialog>

			<Modal.Dialog>
				<Modal.Header>
					<Modal.Title>Instructions</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					{RenderInstructions()}
				</Modal.Body>
			</Modal.Dialog>
		</div>
	)
}

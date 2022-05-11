import './RecipeComponent.css'
import { Recipe } from '../../Interfaces'
import { NavLink } from 'react-router-dom';
import { useContext, useState } from 'react';
import { userContext } from '../../Context'

import { Card, ListGroup, Modal, Accordion } from 'react-bootstrap';

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

	function ShowUserButtons() {
		return (
			<>
				<i className="fa fa-star favorite" aria-hidden="true"></i>
			</>
		)
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

	function RenderDescription() {

		if (recipe.description === undefined || recipe.description === "") return;

		return (
			<Card.Body>
				<Accordion>
					<Accordion.Item eventKey="0">
						<Accordion.Header>Description</Accordion.Header>
						<Accordion.Body>
							{recipe.description}
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Card.Body>
		)
	}

	function RenderImage(image: string) {
		if (image === "") return

		return (
			<Modal.Dialog>
				<Card.Img variant="top" className='recipe-image' src={image} />
				{RenderDescription()}
			</Modal.Dialog>
		)
	}

	return (
		<div className='recipe-component'>
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

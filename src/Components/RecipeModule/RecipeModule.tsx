import './RecipeModule.css'
import { Recipe } from '../../Interfaces'
import { NavLink } from 'react-router-dom';
import { useContext, useState } from 'react';

import { userContext } from '../../Context'
import { InputGroup, FormControl, ListGroup, Tabs, Tab, Modal } from 'react-bootstrap';

export default function RecipeModule({ recipeList, activeUser }: any) {
	const recipes = recipeList as Recipe[]
	const [recipeIndex, setRecipeIndex] = useState<number>(0)
	const { username } = useContext(userContext)
	const [key, setKey] = useState('recipes');

	if (recipes == undefined || recipes[0] == undefined) return <></>;

	const ShowEditButton = () => {
		if (username == recipes[recipeIndex].userOwner) {
			return <>
				<NavLink to={`/users/${recipes[recipeIndex].userOwner}/${recipes[recipeIndex].id}/edit`}>Edit</NavLink>
				<br></br>
			</>
		}

		return <></>
	}

	function RenderRecipeList() {
		return (
			<ListGroup>
				{
					recipes.map((r, index) => {
						return (
							<ListGroup.Item action onClick={e => { setRecipeIndex(index); setKey("current"); }} className={`${index == recipeIndex ? 'active' : ''} recipe-snippet`} key={index}>
								{r.recipeName}
							</ListGroup.Item>
						)
					})
				}
			</ListGroup>
		)
	}

	function RenderIngredientsList() {
		return (
			<ListGroup>
				{
					recipes[recipeIndex].ingredients.map((ingredient, index) => {
						return (
							<ListGroup.Item key={index}>
								<input type='checkbox'></input>
								{ingredient.ingredientName}: {ingredient.ingredientAmount}
							</ListGroup.Item>
						)
					})
				}
			</ListGroup>
		)
	}

	function RenderInstructionsList() {
		return (
			<ListGroup as='ol' numbered>
				{
					recipes[recipeIndex].instructions.map((instruction, index) => {
						return (
							<ListGroup.Item as='li' key={index}>{instruction}</ListGroup.Item>
						)
					})
				}
			</ListGroup>
		)
	}

	return (
		<>
			<Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3" activeKey={key} onSelect={(k) => setKey(k || "recipes")}>

				<Tab eventKey="recipes" title="Recipes">
					{RenderRecipeList()}
				</Tab>

				<Tab eventKey="current" title="Current">
					<Modal.Dialog>
						<Modal.Header>
							<Modal.Title>{recipes[recipeIndex].recipeName}</Modal.Title>
						</Modal.Header>

						<Modal.Body>
							<ShowEditButton />
							By: <NavLink to={`/users/${recipes[recipeIndex].userOwner}`}>{recipes[recipeIndex].userOwner}</NavLink> <br></br>
							<NavLink to={`/users/${recipes[recipeIndex].userOwner}/${recipes[recipeIndex].id}`}>View Recipe Link</NavLink>
						</Modal.Body>
					</Modal.Dialog>

					<Modal.Dialog>
						<Modal.Header>
							<Modal.Title>Ingredients</Modal.Title>
						</Modal.Header>

						<Modal.Body>
							{RenderIngredientsList()}
						</Modal.Body>
					</Modal.Dialog>

					<Modal.Dialog>
						<Modal.Header>
							<Modal.Title>Instructions</Modal.Title>
						</Modal.Header>

						<Modal.Body>
							{RenderInstructionsList()}
						</Modal.Body>
					</Modal.Dialog>
				</Tab>
			</Tabs>
		</>
	)
}

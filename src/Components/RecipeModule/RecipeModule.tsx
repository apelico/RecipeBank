import './RecipeModule.css'
import { Recipe } from '../../Interfaces'
import { NavLink } from 'react-router-dom';
import { useContext, useState } from 'react';

import { userContext } from '../../Context'
import { InputGroup, FormControl, ListGroup, Tabs, Tab } from 'react-bootstrap';

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

	return (
		<>
			<div className='recipe-module desktop'>

				<div className='recipe-nav-bar'>
					<ListGroup>
						{
							recipes.map((r, index) => {
								return (
									<ListGroup.Item action onClick={e => setRecipeIndex(index)} className={`${index == recipeIndex ? 'active' : ''} recipe-snippet`} key={index}>
										{r.recipeName}
									</ListGroup.Item>
								)
							})
						}
					</ListGroup>
				</div>

				<div className='recipe'>
					<div className='recipe-container'>
						<div className='header'>
							<h3>{recipes[recipeIndex].recipeName} </h3>
							<ShowEditButton />
							By: <NavLink to={`/users/${recipes[recipeIndex].userOwner}`}>{recipes[recipeIndex].userOwner}</NavLink> <br></br>
							<NavLink to={`/users/${recipes[recipeIndex].userOwner}/${recipes[recipeIndex].id}`}>View Recipe Link</NavLink>
						</div>

						<div className='ingredients'>
							<h3>Ingredients</h3>
							<ListGroup>
								{
									recipes[recipeIndex].ingredients.map((ingredient, index) => {
										return (
											<ListGroup.Item key={index}>
												<input type='checkbox' className='custom-control-input'></input>
												{ingredient.ingredientName}: ${ingredient.ingredientAmount}
											</ListGroup.Item>
										)
									})
								}
							</ListGroup>
						</div>

						<div className='instructions'>
							<h3>Instructions</h3>
							<ListGroup as='ol' numbered>
								{
									recipes[recipeIndex].instructions.map((instruction, index) => {
										return (
											<ListGroup.Item as='li' key={index}>{instruction}</ListGroup.Item>
										)
									})
								}
							</ListGroup>
						</div>
					</div>
				</div>

			</div>
		</>
	)
}

/*
			<div className='mobile'>
				<Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3" activeKey={key} onSelect={(k) => setKey(k || "recipes")}>

					<Tab eventKey="recipes" title="Recipes">
						<ListGroup>
							{
								recipes.map((r, index) => {
									return (
										<ListGroup.Item action onClick={e => {setKey("current"); setRecipeIndex(index)}} className={`${index == recipeIndex ? 'active' : ''} recipe-snippet`} key={index}>
											{r.recipeName}
										</ListGroup.Item>
									)
								})
							}
						</ListGroup>
					</Tab>

					<Tab eventKey="current" title="Current">
						<div className='recipe-container'>
							<div className='header'>
								<h3>{recipes[recipeIndex].recipeName} </h3>
								<ShowEditButton />
								By: <NavLink to={`/users/${recipes[recipeIndex].userOwner}`}>{recipes[recipeIndex].userOwner}</NavLink> <br></br>
								<NavLink to={`/users/${recipes[recipeIndex].userOwner}/${recipes[recipeIndex].id}`}>View Recipe Link</NavLink>
							</div>

							<div className='ingredients'>
								<h3>Ingredients</h3>
								<ListGroup>
									{
										recipes[recipeIndex].ingredients.map((ingredient, index) => {
											return (
												<ListGroup.Item key={index}>
													<input type='checkbox' className='custom-control-input'></input>
													{ingredient.ingredientName}: ${ingredient.ingredientAmount}
												</ListGroup.Item>
											)
										})
									}
								</ListGroup>
							</div>

							<div className='instructions'>
								<h3>Instructions</h3>
								<ListGroup as='ol' numbered>
									{
										recipes[recipeIndex].instructions.map((instruction, index) => {
											return (
												<ListGroup.Item as='li' key={index}>{instruction}</ListGroup.Item>
											)
										})
									}
								</ListGroup>
							</div>
						</div>
					</Tab>
				</Tabs>

			</div>
*/

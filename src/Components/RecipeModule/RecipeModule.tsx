import './RecipeModule.css'
import { Recipe } from '../../Interfaces'
import { NavLink } from 'react-router-dom';
import { useContext, useState } from 'react';

import { userContext } from '../../Context'

export default function RecipeModule({ recipeList, activeUser }: any) {
	const recipes = recipeList as Recipe[]
	const [recipeIndex, setRecipeIndex] = useState<number>(0)
	const {username} = useContext(userContext)

	if (recipes == undefined || recipes[0] == undefined) return <></>;

	const ShowEditButton = () => {
		if(username == recipes[recipeIndex].userOwner){
			return<>
			<NavLink to={`/users/${recipes[recipeIndex].userOwner}/${recipes[recipeIndex].id}/edit`}>Edit</NavLink>
			<br></br>
			</>
		}

		return <></>
	}

	return (
		<div className='recipe-module'>

			<div className='recipe-nav-bar'>
				<ul>
					{
						recipes.map((r, index) => {
							return (
								<li onClick={e => setRecipeIndex(index)} className={`${index == recipeIndex ? 'active' : ''} recipe-snippet`} key={index}>
									{r.recipeName}
								</li>
							)
						})
					}
				</ul>
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
						<ul>
						{
							recipes[recipeIndex].ingredients.map((ingredient, index) => {
								return (
									<li key={index}>
										{ingredient.ingredientName}: {ingredient.ingredientAmount}
									</li>
								)
							})
						}
						</ul>
					</div>

					<div className='instructions'>
						<h3>Instructions</h3>
						<ul>
							{
								recipes[recipeIndex].instructions.map((instruction, index) => {
									return (
										<li key={index}>{instruction}</li>
									)
								})
							}
						</ul>
					</div>
				</div>

			</div>

		</div>
	)
}

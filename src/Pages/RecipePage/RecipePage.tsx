import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom';
import { Recipe } from '../../Interfaces'
import './RecipePage.css'

export default function RecipePage() {
  const [recipe, setRecipe] = useState<Recipe>()
  const { recipeID, username } = useParams();

  useEffect(() => {
    fetch('/api/getRecipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userOwner: username, id: recipeID })
    }).then(response => response.json()).then(data => {
      setRecipe(data)
    })
  }, [])

  return (
    <div className='page'>
      <div className='recipe'>
        <div className='header'>
          <h3>{recipe?.recipeName} </h3>
          By: <NavLink to={`/users/${recipe?.userOwner}`}>{recipe?.userOwner}</NavLink> <br></br>
        </div>

        <div className='ingredients'>
          <h3>Ingredients</h3>
          <ul>
            {
              recipe?.ingredients.map((ingredient, index) => {
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
              recipe?.instructions.map((instruction, index) => {
                return (
                  <li key={index}>{instruction}</li>
                )
              })
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

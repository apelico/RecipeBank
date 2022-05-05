import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import RecipeComponent from '../../Components/RecipeComponent/RecipeComponent';
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

  if(recipe == undefined) return <></>;

  return (
    <RecipeComponent recipe={recipe} />
  )
}

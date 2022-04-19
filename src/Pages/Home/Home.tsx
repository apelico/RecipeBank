import './Home.css'
import { useEffect, useState } from 'react'
import RecipeModule from '../../Components/RecipeModule/RecipeModule'
import { Recipe } from '../../Interfaces'

export default function Home() {
  const[recipes, setRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    fetch('/api/getAllRecipes', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		}).then(response => response.json()).then(data => {
			setRecipes(data)
		})
  },[])

  return (
    <div className='page'>
      <RecipeModule recipeList={recipes} />
    </div>
  )
}

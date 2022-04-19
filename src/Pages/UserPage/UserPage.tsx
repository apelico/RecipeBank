import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom'
import RecipeModule from '../../Components/RecipeModule/RecipeModule';
import { Recipe, User } from '../../Interfaces';
import './UserPage.css'

export default function UserPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const { username } = useParams();

  useEffect(() => {
    fetch('/api/getUserRecipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username })
    }).then(response => response.json()).then(data => {
      setRecipes(data)
    })
  }, [])

  return (
    <div className='page'>
      <RecipeModule recipeList={recipes} />
    </div>
  )
}

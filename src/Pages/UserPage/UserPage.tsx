import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { Tabs, Tab } from 'react-bootstrap';
import { Recipe } from '../../Interfaces';
import './UserPage.css'
import RecipeComponent from '../../Components/RecipeComponent/RecipeComponent';
import RecipeListComponent from '../../Components/RecipeListComponent/RecipeListComponent';

export default function UserPage() {
  const { username } = useParams();
  const [key, setKey] = useState("user");
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [activeRecipe, setActiveRecipe] = useState<Recipe>()

  useEffect(() => {
    fetch('/api/getUserRecipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username })
    }).then(response => response.json()).then(data => {
      setRecipes(data)
    })
  }, [])

  function SelectRecipe(selectedIndex: number) {
    setKey("current")
    setActiveRecipe(recipes[selectedIndex])
  }

  return (
    <div className='page'>
      <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3 recipe-module" activeKey={key} onSelect={(k) => setKey(k || "recipes")}>

        <Tab eventKey="user" title={username} >

        </Tab>

        <Tab eventKey="recipes" title="Recipes">
          <RecipeListComponent recipes={recipes} SelectRecipe={SelectRecipe} />
        </Tab>

        <Tab eventKey="current" title="Current">
        {
					(activeRecipe !== undefined) && <RecipeComponent recipe={activeRecipe} />
				}
        </Tab>
      </Tabs>
    </div>
  )
}

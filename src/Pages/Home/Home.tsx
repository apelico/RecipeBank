import './Home.css'
import { useEffect, useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap';
import { Recipe } from '../../Interfaces'
import RecipeComponent from '../../Components/RecipeComponent/RecipeComponent';
import RecipeListComponent from '../../Components/RecipeListComponent/RecipeListComponent';

export default function Home() {
	const [recipes, setRecipes] = useState<Recipe[]>([])
	const [activeRecipe, setActiveRecipe] = useState<Recipe>()
	const [key, setKey] = useState('recipes');

	useEffect(() => {
		fetch('/api/getAllRecipes', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		}).then(response => response.json()).then(data => {
			setRecipes(data)
		})
	}, [])

	function SelectRecipe(selectedIndex: number) {
		setKey("current")
		setActiveRecipe(recipes[selectedIndex])
	}

	return (
		<Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3 recipe-module" activeKey={key} onSelect={(k) => setKey(k || "recipes")}>

			<Tab eventKey="recipes" title="Recipes">
				<RecipeListComponent recipes={recipes} SelectRecipe={SelectRecipe} />
			</Tab>

			<Tab eventKey="current" title="Current">
				{
					(activeRecipe !== undefined) && <RecipeComponent recipe={activeRecipe} />
				}
			</Tab>
		</Tabs>
	)
}

import React from 'react'
import { useEffect, useState } from 'react'
import { Button, Form, FormControl, InputGroup, FloatingLabel } from 'react-bootstrap'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { EditType, IEdit, Ingredient, Recipe } from '../../Interfaces'
import './EditRecipe.css'

export default function EditRecipe({ editType }: IEdit) {
	const navigate = useNavigate()
	const location = useLocation()

	const [recipe, setRecipe] = useState<Recipe>()
	const { username, recipeID } = useParams();

	useEffect(() => {
		if (editType == EditType.Create) {
			setRecipe({ recipeName: "", ingredients: [], instructions: [] })
			return;
		}

		fetch('/api/getRecipe', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userOwner: username, id: recipeID })
		}).then(response => response.json()).then(data => {
			setRecipe(data)
		})
	}, [location.key])

	function HandleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (editType == EditType.Create) {
			fetch('/api/createRecipe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(recipe)
			}).then(response => response.json()).then(data => {
				if (data == "OK") navigate("/")
			})
		}

		if (editType == EditType.Edit) {
			fetch('/api/updateRecipe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(recipe)
			}).then(response => response.json()).then(data => {
				if (data == "OK") navigate("/")
			})
		}
	}

	function AddIngredient() {
		const r = { ...recipe }
		r.ingredients?.push({ ingredientName: "", ingredientAmount: "" });

		setRecipe(r as Recipe);
	}

	function UpdateIngredient(index: number, ingredient: Ingredient) {
		const r = { ...recipe }
		if (r.ingredients == undefined) return;

		r.ingredients[index] = ingredient

		setRecipe(r as Recipe)
	}

	function RemoveIngredient(index: number) {
		const r = { ...recipe }
		r.ingredients?.splice(index, 1)
		setRecipe(r as Recipe)
	}

	function AddInstruction() {
		const r = { ...recipe }
		r.instructions?.push("")

		setRecipe(r as Recipe)
	}

	function UpdateInstruction(index: number, value: string) {
		const r = { ...recipe }
		if (r.instructions == undefined) return;

		r.instructions[index] = value

		setRecipe(r as Recipe)
	}

	function RemoveInstruction(index: number) {
		const r = { ...recipe }
		r.instructions?.splice(index, 1)
		setRecipe(r as Recipe)
	}

	function RenderTitle() {
		if (recipe === undefined) return

		return (
			<InputGroup size="lg">
				<FormControl placeholder='Recipe Name' value={recipe.recipeName} onChange={e => {
					const r = { ...recipe }
					r.recipeName = e.target.value;
	
					setRecipe(r as Recipe);
				}} />
		  	</InputGroup>
		)
	}

	function RenderInstructions() {
		if (recipe === undefined) return

		return (
			recipe.instructions.map((instruction, index) => {
				return(
				<InputGroup className='mb-3 ingredients'>
					<FormControl placeholder='ingredient' value={instruction} onChange={e => {
						UpdateInstruction(index, e.target.value)
					}} />
					<Button variant="danger" onClick={() => {
						RemoveInstruction(index)
					}}>Delete</Button>
				</InputGroup>
				)
			})
		)
	}

	function RenderIngredients() {
		if (recipe === undefined) return

		return (
			recipe.ingredients.map((ingredient, index: number) => {
				return (
					<>
						<InputGroup className='mb-3 ingredients'>
							<FormControl placeholder='ingredient' value={ingredient.ingredientName} onChange={e => {
								UpdateIngredient(index, { ingredientName: e.target.value, ingredientAmount: ingredient.ingredientAmount })
							}} />
							<FormControl placeholder='amount' value={ingredient.ingredientAmount} onChange={e => {
								UpdateIngredient(index, { ingredientName: ingredient.ingredientName, ingredientAmount: e.target.value })
							}}/>
							<Button variant="danger" onClick={() => {
								RemoveIngredient(index)
							}}>Delete</Button>
						</InputGroup>
					</>
				)
			})
		)
	}

	return (
		<div className='page'>
			<form className='edit-recipe' onSubmit={HandleSubmit}>
				{RenderTitle()}

				<h3>Ingredients</h3>
				{RenderIngredients()}
				<Button variant="primary" onClick={AddIngredient}>Add Ingredient</Button>

				<h3>Instructions</h3>
				{RenderInstructions()}

				<Button variant="primary" onClick={AddInstruction}>Add Instruction</Button>
				<div>
					<br></br>
					<Button variant="primary" type='submit'>Submit</Button>
				</div>
			</form>
		</div>

	)
}

import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { EditType, IEdit, Ingredient, Recipe } from '../../Interfaces'
import './EditRecipe.css'

export default function EditRecipe({ editType }: IEdit) {
	const navigate = useNavigate()
	const location = useLocation()

	const [recipe, setRecipe] = useState<Recipe>()
	const { username, recipeID } = useParams();

	useEffect(() => {
		if (editType == EditType.Create){
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

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
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
			/*fetch('/api/updateRecipe', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(recipe)
		}).then(response => response.json()).then(data => {

		})*/
		}
	}

	const addIngredient = (): void => {
		const r = { ...recipe }
		r.ingredients?.push({ ingredientName: "", ingredientAmount: "" });

		setRecipe(r as Recipe);
	}

	const updateIngredient = (index: number, ingredient: Ingredient): void => {
		const r = { ...recipe }
		if (r.ingredients == undefined) return;

		r.ingredients[index] = ingredient

		setRecipe(r as Recipe)
	}

	const removeIngredient = (index: number): void => {
		const r = { ...recipe }
		r.ingredients?.splice(index, 1)
		setRecipe(r as Recipe)
	}

	const addInstruction = (): void => {
		const r = { ...recipe }
		r.instructions?.push("")

		setRecipe(r as Recipe)
	}

	const updateInstruction = (index: number, value: string): void => {
		const r = { ...recipe }
		if (r.instructions == undefined) return;

		r.instructions[index] = value

		setRecipe(r as Recipe)
	}

	const removeInstruction = (index: number): void => {
		const r = { ...recipe }
		r.instructions?.splice(index, 1)
		setRecipe(r as Recipe)
	}

	interface IngredientProp {
		ingredient: Ingredient;
		index: number;
	}

	const RenderIngredient = (prop: IngredientProp) => {
		return (
			<div key={prop.index} className='inputs'>
				<input type='text' onChange={e => {
					e.preventDefault()
					updateIngredient(prop.index, { ingredientName: e.target.value, ingredientAmount: prop.ingredient.ingredientAmount })
				}}
					value={prop.ingredient.ingredientName}
					placeholder='ingredient' />

				<input type='text' onChange={e => {
					e.preventDefault()
					updateIngredient(prop.index, { ingredientName: prop.ingredient.ingredientName, ingredientAmount: e.target.value })
				}}
					value={prop.ingredient.ingredientAmount}
					placeholder='amount' />

				<button type='button' onClick={() => {
					removeIngredient(prop.index)
				}}>X</button>
			</div>
		)
	}

	interface InstructionProp {
		instruction: string;
		index: number;
	}
	const RenderInstructions = (prop: InstructionProp) => {
		return (
			<div key={prop.index} className='inputs'>
				<input type='text' onChange={e => {
					e.preventDefault()
					updateInstruction(prop.index, e.target.value)
				}}
					value={prop.instruction}
					placeholder='instruction' />

				<button type='button' onClick={() => {
					removeInstruction(prop.index)
				}}>X</button>
			</div>
		)
	}

	const RenderForm = () => {
		return (
			<form onSubmit={handleSubmit} className='edit-recipe'>

				<input type='text' name='name' className='recipe-name' value={recipe?.recipeName} onChange={e => {
					const r = { ...recipe }
					r.recipeName = e.target.value;

					setRecipe(r as Recipe);
				}} placeholder='Recipe Name' />

				<h3>Ingredients</h3>
				{
					recipe?.ingredients.map((ingredient, index) => {
						return (<RenderIngredient ingredient={ingredient} index={index} key={index} />)
					})
				}
				<button type='button' value={'Add Ingredient'} onClick={addIngredient}>Add Ingredient</button>

				<h3>Instructions</h3>
				{recipe?.instructions.map((instruction, index) => {
					return (<RenderInstructions instruction={instruction} index={0} key={index} />)
				})}

				<button type='button' value={'Add Instruction'} onClick={e => addInstruction()}>Add Instruction</button>
				<br></br>
				<input type='submit' />
			</form>
		)
	}

	return (
		<div className='page'>
			<RenderForm />
		</div>
		
	)
}

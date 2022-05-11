import React from 'react'
import { useEffect, useState } from 'react'
import { Button, Card, FormControl, InputGroup, Modal } from 'react-bootstrap'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { EditType, IEdit, Ingredient, Recipe } from '../../Interfaces'
import Resizer from "react-image-file-resizer";
import './EditRecipe.css'

export default function EditRecipe({ editType }: IEdit) {
	const navigate = useNavigate()
	const location = useLocation()

	const [recipe, setRecipe] = useState<Recipe>()
	const { username, recipeID } = useParams();

	useEffect(() => {
		if (editType === EditType.Create) {
			setRecipe({ recipeName: "", ingredients: [{ ingredientName: "", ingredientAmount: "" }], instructions: [""] })
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

	const resizeFile = (file: any) =>
		new Promise((resolve) => {
			Resizer.imageFileResizer(
				file,
				1024,
				1024,
				"JPEG",
				50,
				0,
				(uri) => {
					resolve(uri);
				},
				"base64"
			);
		});

	function HandleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (editType === EditType.Create) {
			fetch('/api/createRecipe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(recipe)
			}).then(response => response.json()).then(data => {
				if (data === "OK") navigate("/")
			})
		}

		if (editType === EditType.Edit) {
			fetch('/api/updateRecipe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(recipe)
			}).then(response => response.json()).then(data => {
				if (data === "OK") navigate("/")
			})
		}
	}

	async function SetRecipeImage(imageFile: any) {
		if (recipe === undefined) return;

		const resizedFile = await resizeFile(imageFile)

		const r = { ...recipe }
		r.image = resizedFile as string;

		setRecipe(r as Recipe);
	}

	function AddIngredient() {
		const r = { ...recipe }
		r.ingredients?.push({ ingredientName: "", ingredientAmount: "" });

		setRecipe(r as Recipe);
	}

	function UpdateIngredient(index: number, ingredient: Ingredient) {
		const r = { ...recipe }
		if (r.ingredients === undefined) return;

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
		if (r.instructions === undefined) return;

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
				<FormControl className='title' placeholder='Recipe Name' required value={recipe.recipeName} onChange={e => {
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
				return (
					<InputGroup key={index} className='mb-3 ingredients'>
						<FormControl placeholder='instruction' value={instruction} onChange={e => {
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
					<InputGroup key={index} className='mb-3 ingredients'>
						<FormControl placeholder='ingredient' value={ingredient.ingredientName} onChange={e => {
							UpdateIngredient(index, { ingredientName: e.target.value, ingredientAmount: ingredient.ingredientAmount })
						}} />
						<FormControl placeholder='amount' value={ingredient.ingredientAmount} onChange={e => {
							UpdateIngredient(index, { ingredientName: ingredient.ingredientName, ingredientAmount: e.target.value })
						}} />
						<Button variant="danger" onClick={() => {
							RemoveIngredient(index)
						}}>Delete</Button>
					</InputGroup>
				)
			})
		)
	}

	function RenderImage() {
		return (
			<>
				<Card.Img variant='top' className='recipe-image' src={recipe?.image} />
				<input type='file' name='image' accept="image/*" onChange={e => { if (e.target.files !== null) { SetRecipeImage(e.target.files[0]) } }} />
			</>
		)
	}

	function RenderDescription() {
		//if (recipe?.description === undefined) return;
		return (
			<Modal.Dialog>
				<Modal.Header>
					<Modal.Title>Description</Modal.Title>
				</Modal.Header>
				<InputGroup>
					<FormControl as="textarea" aria-label="With textarea" maxLength={1000} rows={5} value={recipe?.description} onChange={e => {
						const r = { ...recipe }
						r.description = e.target.value;

						setRecipe(r as Recipe);
					}} />
				</InputGroup>
			</Modal.Dialog>
		)
	}

	return (
		<form className='edit-recipe' onSubmit={HandleSubmit}>
			<Modal.Dialog>
				<Modal.Header>
					<Modal.Title>{RenderTitle()}</Modal.Title>
				</Modal.Header>
			</Modal.Dialog>

			<Modal.Dialog>
				<Modal.Body>
					{RenderImage()}
					{RenderDescription()}
				</Modal.Body>
			</Modal.Dialog>

			<Modal.Dialog>
				<Modal.Header>
					<Modal.Title>Ingredients</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{RenderIngredients()}
				</Modal.Body>
				<Button variant="primary" onClick={AddIngredient}>Add Ingredient</Button>
			</Modal.Dialog>

			<Modal.Dialog>
				<Modal.Header>
					<Modal.Title>Instructions</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{RenderInstructions()}
				</Modal.Body>
				<Button variant="primary" onClick={AddInstruction}>Add Instruction</Button>
			</Modal.Dialog>

			<Modal.Dialog>
				<Button variant="primary" type='submit'>Submit</Button>
			</Modal.Dialog>
		</form >
	)
}

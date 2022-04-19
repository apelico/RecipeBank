import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import './CreateRecipe.css'

import { Recipe, Ingredient } from '../../Interfaces'

export default function CreateRecipe() {
    const navigate = useNavigate()

    const [recipeName, setRecipeName] = useState<string>("");
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [instructions, setInstructions] = useState<string[]>([]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        let recipe: Recipe = { recipeName: recipeName, ingredients: ingredients, instructions: instructions };

        fetch('/api/createRecipe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipe)
        }).then(response => response.json()).then(data => {
            if (data == "OK") navigate("/")
        })
    }

    const addIngredient = (): void => {
        setIngredients([...ingredients, { ingredientName: "", ingredientAmount: "" }]);
    }

    const addInstruction = (): void => {
        setInstructions([...instructions, ""])
    }

    const removeIngredient = (index: number): void => {
        const newIngredients = [...ingredients]
        newIngredients.splice(index, 1)
        setIngredients(newIngredients)
    }

    return (
        <div className='page'>
            <form onSubmit={handleSubmit} className='create-recipe'>
                <input className='recipeNameInput' type='text' name='name' onChange={e => {
                    setRecipeName(e.target.value);
                }} placeholder='Recipe Name' />

                <p>Ingredients</p>
                {ingredients.map((ingredient, index) => {
                    return (
                        <div className='inputs' key={index}>
                            <input type='text' className='ingredient' onChange={e => {
                                e.preventDefault()
                                const ingredientName = e.target.value
                                setIngredients((currentIngredients) => currentIngredients.map(x => x === ingredient ? {
                                    ...x, ingredientName
                                } : x));
                            }}
                                value={ingredient.ingredientName}
                                placeholder='ingredient' />

                            <input type='text' onChange={e => {
                                e.preventDefault()
                                const ingredientAmount = e.target.value

                                setIngredients((currentIngredient) => currentIngredient.map(x => x === ingredient ? {
                                    ...x, ingredientAmount
                                } : x))
                            }}
                                value={ingredient.ingredientAmount}
                                placeholder='amount' />

                            <button type='button' className='delete' onClick={() => {
                                removeIngredient(index)
                            }}>X</button>
                        </div>
                    )
                })}
                <button type='button' value={'Add Ingredient'} onClick={addIngredient}>Add Ingredient</button>

                <p>Instructions</p>
                {instructions.map((step, index) => {
                    return (
                        <div key={index} className='inputs'>
                            <input type='text' onChange={e => {
                                e.preventDefault()
                                const instructionsClone = [...instructions]
                                instructionsClone[index] = e.target.value;
                                setInstructions(instructionsClone);
                            }}
                                value={step}
                                placeholder='instruction' />

                            <button type='button' className='delete' onClick={() => {
                                const instructionsClone = [...instructions]
                                instructionsClone.splice(index, 1);
                                setInstructions(instructionsClone);
                            }}>X</button>
                        </div>
                    )
                })}

                <button type='button' value={'Add Instruction'} onClick={e => addInstruction()}>Add Instruction</button>
                <br></br>
                <input type='submit' />
            </form>
        </div>
    )
}

import { useEffect, useState } from 'react'
import { ListGroup, Modal, Tab, Tabs } from 'react-bootstrap';
import { NavLink, useParams } from 'react-router-dom';
import RecipeModule from '../../Components/RecipeModule/RecipeModule';
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

  function RenderIngredientsList() {
    if (recipe === undefined) return;

    return (
      <ListGroup>
        {
          recipe.ingredients.map((ingredient, index) => {
            return (
              <ListGroup.Item key={index}>
                <input type='checkbox'></input>
                {" "}{ingredient.ingredientAmount} {ingredient.ingredientName}
              </ListGroup.Item>
            )
          })
        }
      </ListGroup>
    )
  }

  function RenderInstructionsList() {
    if (recipe === undefined) return;

    return (
      <ListGroup as='ol' numbered>
        {
          recipe.instructions.map((instruction, index) => {
            return (
              <ListGroup.Item as='li' key={index}>{instruction}</ListGroup.Item>
            )
          })
        }
      </ListGroup>
    )
  }

  function RenderImage(image: string) {
    if (image === "") return

    return (
      <Modal.Dialog>
        <img className='recipe-image' src={image} />
      </Modal.Dialog>
    )
  }

  return (
    <>
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>{recipe?.recipeName}</Modal.Title> <Modal.Title><span className='recipe-owner'>by: <NavLink to={`/users/${recipe?.userOwner}`}>{recipe?.userOwner}</NavLink></span></Modal.Title>
        </Modal.Header>
      </Modal.Dialog>

      {RenderImage(recipe?.image || "")}

      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Ingredients</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {RenderIngredientsList()}
        </Modal.Body>
      </Modal.Dialog>

      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Instructions</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {RenderInstructionsList()}
        </Modal.Body>
      </Modal.Dialog>
    </>
  )
}

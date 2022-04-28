import "./NavBar.css"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation
} from 'react-router-dom'
import CreateRecipe from "../../Pages/CreateRecipe/CreateRecipe";
import Login from "../../Pages/Login/Login";
import Register from "../../Pages/Register/Register";
import Home from "../../Pages/Home/Home";

import { userContext } from '../../Context'
import { useContext, useEffect } from "react";
import UserPage from "../../Pages/UserPage/UserPage";
import EditRecipe from "../../Pages/EditRecipe/EditRecipe";
import RecipePage from "../../Pages/RecipePage/RecipePage";
import { EditType } from "../../Interfaces";
import { Container, Nav, Navbar } from "react-bootstrap";

export default function NavBar() {
  const { username, Logout, CheckUser } = useContext(userContext)

  const RenderLoginButton = () => {
    if (username == '') {
      return (
        <Nav.Link href='/Login'>Login</Nav.Link>
      )
    }

    return (
      <Nav.Link onClick={Logout}>Logout</Nav.Link>
    )
  }

  const RenderUserOption = () => {
    if (username != '') {
      return (
        <>
          <Nav.Link href='/Create'>Create</Nav.Link>
          <Nav.Link href={`/users/${username}`}>MyRecipes</Nav.Link>
        </>
      )
    }

    return <></>
  }

  //Checks if the token is still valid and not expired on route change. If so, logout and remove token cookie
  const useCheckRouteChange = () => {
    const location = useLocation();
    useEffect(() => {
      CheckUser()

    }, [location]);
  };

  const HandleRoutes = () => {
    useCheckRouteChange()
    return (
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/create' element={<EditRecipe editType={EditType.Create} />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/users/:username' element={<UserPage />}></Route>
        <Route path='/users/:username/:recipeID' element={<RecipePage />}></Route>
        <Route path='/users/:username/:recipeID/edit' element={<EditRecipe editType={EditType.Edit} />}></Route>
      </Routes>
    )
  }

  return (
    <Router>
      <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">Recipe Trunk</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>

            <RenderUserOption />
            <RenderLoginButton />
          </Nav>
      </Navbar>

      <HandleRoutes />
    </Router>
  );
}

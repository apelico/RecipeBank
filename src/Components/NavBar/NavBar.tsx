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

export default function NavBar() {
  const { username, Logout, CheckUser } = useContext(userContext)

  const RenderLoginButton = () => {
    if (username == '') {
      return (
        <>
          <li>
            <NavLink to='/Login'>Login</NavLink>
          </li>
        </>
      )
    }

    return (
      <>
        <li>
          <a onClick={Logout}>Logout</a>
        </li>
      </>
    )
  }

  const RenderUserOption = () => {
    if (username != '') {
      return (
        <>
          <li>
            <NavLink className={navData => (navData.isActive ? 'active' : '')} to='/Create'>Create</NavLink>
          </li>
          <li>
            <NavLink className={navData => (navData.isActive ? 'active' : '')} to={`/users/${username}`}>MyRecipes</NavLink>
          </li>
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
      <nav>
        <ul>
          <li>
            <NavLink className={navData => (navData.isActive ? 'active' : '')} to='/'>Home</NavLink>
          </li>

          <RenderUserOption />

          <RenderLoginButton />
        </ul>
      </nav>

      <HandleRoutes />
    </Router>
  );
}

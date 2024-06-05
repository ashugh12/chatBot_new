import AppBar from "@mui/material/AppBar"
import { Toolbar } from '@mui/material';
import Logo from './shared/Logo';
import { useAuth } from '../context/AuthContext';
import NavigationLink from './shared/NavigationLink';

const Header = () => {
  const auth = useAuth();
  return (<AppBar sx={{bgcolor:"transparent", position: "static", boxShadow:"none"}}>
    <Toolbar sx={{display:"flex" }}>
      <Logo />
      <div>{auth?.isLoggedIn ? 
      (<>
        <NavigationLink bg='#5905e2'
        to='/chat'
        text='Go To Chat'
        textColor='white'          
        />
        <NavigationLink 
          bg='#51538f'
          to='/'
          text='logout'
          textColor='white' 
          onClick={auth.logout}
        />
      </> )
      : 
      (<>
        <NavigationLink 
        bg='#5905e2'
        to='/login'
        text='Log In'
        textColor='white'          
        />
        <NavigationLink 
          bg='#51538f'
          to='/signup'
          text='Signup'
          textColor='white' 
        />
      </>)}</div>
    </Toolbar>
  </AppBar>
  )
}

export default Header

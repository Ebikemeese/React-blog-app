import { BrowserRouter, Routes, Route, data } from "react-router-dom";
import AppLayout from "./ui_components/AppLayout";
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import ProfilePage from "./pages/ProfilePage";
import SignupPage from "./pages/SignupPage";
import CreatePostPage from "./pages/CreatePostPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./ui_components/ProtectedRoute";
import { useEffect, useState } from "react"
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { getUsername } from "./services/ApiBlog";

const App = () => {

  const [username, setUsername] = useState(null)
  const [IsAuthenticated, setIsAuthenticated]= useState(false)

  const {data} = useQuery({
    queryKey: ["username"],
    queryFn: getUsername
  })

  useEffect(function(){
    if(data){
      setUsername(data.username)
      setIsAuthenticated(true)
    }
  }, [data])

  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout IsAuthenticated={IsAuthenticated} username={username} setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />}>

            <Route path="*" element={<NotFoundPage />} />
            <Route index element={<HomePage />} />
            <Route path="blogs/:slug" element={<DetailPage username={username} IsAuthenticated={IsAuthenticated} />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="create_blog" element={ <ProtectedRoute> <CreatePostPage IsAuthenticated={IsAuthenticated} /> </ProtectedRoute> } />
            <Route path="login" element={ <LoginPage setIsAuthenticated={ setIsAuthenticated } setUsername={setUsername} /> } />
            <Route path="profile/:username" element={<ProfilePage authUsername={username} /> } />
            
          </Route>
        </Routes>
      </BrowserRouter>
    
  );
};

export default App;
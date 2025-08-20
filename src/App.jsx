import { BrowserRouter, Routes, Route, data } from "react-router-dom";
import AppLayout from "./ui_components/AppLayout";
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import ProfilePage from "./pages/ProfilePage";
import SignupPage from "./pages/SignupPage";
import CreatePostPage from "./pages/CreatePostPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
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
            <Route path="signup" element={<SignupPage setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />} />
            <Route path="create_blog" element={ <ProtectedRoute> <CreatePostPage IsAuthenticated={IsAuthenticated} /> </ProtectedRoute> } />
            <Route path="login" element={ <LoginPage setIsAuthenticated={ setIsAuthenticated } setUsername={setUsername} /> } />
            <Route path="profile/:username" element={<ProfilePage authUsername={username} /> } />
            <Route path="verify_email" element={<VerifyEmailPage />} />
            <Route path="reset_password/:uidb64/:token" element={<ResetPasswordPage />} />
            <Route path="reset_password_request" element={<ForgotPasswordPage />} />
            <Route path="change_password" element={<ChangePasswordPage setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    
  );
};

export default App;
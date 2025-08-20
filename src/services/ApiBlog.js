import api from "@/api"

export async function getBlogs(page){
    try{
        const response = await api.get(`blogs?page=${page}`)
        return response.data
    }

    catch(err){
        throw new Error(err.message)
    }
}

export async function getBlog(slug){
    try{
        const response = await api.get(`blogs/${slug}`)
        return response.data
    }

    catch(err){
        throw new Error(err.message)
    }
}

export async function registerUser(data){
    try{
        const response = await api.post("sign-up/", data)
        return response.data
    }

    catch(err){
        console.log(err)
        if(err.status == 400){
          throw new Error("Email already exists")
        }
        throw new Error(err.response?.data?.message || "Something went wrong. Please try again.");
    }
}

export async function signin(data){
  try{
    const response = await api.post("token/", data)
    return response.data
  }

  catch(err){

    if(err.status == 401){
      throw new Error("Invalid Credentials")
    }
    throw new Error(err)
  }
}

export async function getUsername(){
  try{
    const accessToken = localStorage.getItem("access_token");

    const response = await api.get("get_username", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data

  } catch(err) {
    throw new Error(err.message)
  }
}

export async function createBlog(data){
  try{
    const response = await api.post("create_blog/", data)
    return response.data
  } catch(err) {
    throw new Error(err.message)
    
  }
}

export async function updateBlog(data, id){
  try{
    const response = await api.put(`update_blog/${id}/`, data)
    return response.data
  } catch(err) {
    if(err.response){
      throw new Error(err.response?.data?.message || "Failed to update blog")
    }
    throw new Error(err.message)
  }
}

export async function deleteBlog(id){
  try{
    const response = await api.delete(`delete_blog/${id}/`)
    return response.data
  } catch(err) {
    if(err.response){
      throw new Error(err.response?.data?.message || "Failed to delete blog")
    }
    throw new Error(err.message)
  }
}


export async function getUserInfo(username){
  try{
    const response = await api.get(`get_userinfo/${username}`)
    return response.data
  } catch {
    throw new Error(err.message)
  }
}

export async function updateUserProfile(data, id){
  try{
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await api.patch(`edit_user/${id}/`, data, config)
    return response.data
  } catch(err) {
    if(err.response){
      throw new Error(err?.response?.data.message || "Failed to update profile")
    }
    throw new Error(err.message)
  }
}

export async function verifyOtp(data) {
  try {
    const response = await api.post("verify_email/", data);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "OTP verification failed");
  }
}

export const resendOtp = async (email) => {
  const response = await api.post("resend-otp/", { email });
  return response.data;
};

export async function requestPasswordReset(email) {
  try {
    const response = await api.post("forgot-password/", { email });
    return response.data;
  } catch (err) {
    console.log("Full error object:", err);
    console.log("Error response:", err.response);
    console.log("Error status:", err.response?.status);
    console.log("Error data:", err.response?.data);

    const errorMessage =
      err.response?.data?.message || "Failed to request password reset";
    throw new Error(errorMessage);
  }
}



export async function resetPassword(data) {
  try {
    const response = await api.post("reset_password/", data);
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.detail ||
      err.response?.data?.message ||
      "Failed to reset password"
    );
  }
}

export async function googleSignUp(id_token) {
  try {
    const response = await api.post("auth/google/", { id_token });
    return { success: true, data: response.data };
  } catch (err) {
    const errorData = err.response?.data || {};
    return {
      success: false,
      error: {
        message: errorData.message || "Google sign-in failed",
        email: errorData.email,
        auth_provider: errorData.auth_provider
      }
    };
  }
}

export async function githubSignIn(code) {
  try {
    const response = await api.post("auth/github/", { code });
    
    return { success: true, data: response.data };
  } catch (err) {
    console.log("GitHub Sign-In Error Response:", err.response?.data?.error);

    const error = err.response?.data?.error || {};
    let message = error.message || "GitHub sign-in failed";
    let email = null;
    let auth_provider = null;

    // If detail is a string, extract values using regex
    if (typeof error.detail === "string") {
      const detailStr = error.detail;

      const messageMatch = detailStr.match(/message=.*?'(.*?)'/);
      const emailMatch = detailStr.match(/email=.*?'(.*?)'/);
      const providerMatch = detailStr.match(/auth_provider=.*?'(.*?)'/);

      if (messageMatch) message = messageMatch[1];
      if (emailMatch) email = emailMatch[1];
      if (providerMatch) auth_provider = providerMatch[1];
    }

    return {
      success: false,
      error: {
        message,
        email,
        auth_provider
      }
    };
  }
}





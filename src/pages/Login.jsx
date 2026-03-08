import { GraduationCap, Loader2 } from 'lucide-react';
import {signInWithGoogle} from "../firebase.js"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Login = () => {

 const[loading,setLoading] = useState(false)
 const[error,setError] = useState("")
 const navigate = useNavigate();
const handleGoogleSignIn = async ()=>{
  setLoading(true);
  setError('');
  try{
    await signInWithGoogle();
    navigate('/');
  } catch(err){
    setError(err.message);
    console.log(error)
  } finally {
    setLoading(false);
  }
}
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <GraduationCap size={28} className="text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Student SMS</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to continue</p>
        </div>
        {error && (
  <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
    {error}
  </div>
)}
        <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex h-10 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
          </button>
      </div>
    </div>
  );
};

export default Login;

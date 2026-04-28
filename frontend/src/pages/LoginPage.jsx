import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!email || !password) {
      setError('Please enter both your corporate email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Store token and navigate
        localStorage.setItem("token", data.token);
        navigate('/dashboard');
      } else {
        // Error: Show message from backend
        setError(data.message || "Authentication failed. Please check your credentials.");
      }
    } catch (err) {
      // Network/Server Error
      setError("Connection error: Unable to reach the security server. Please check your internet or try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-[440px] shadow-[0_0_80px_rgba(0,0,0,0.6)] border-white/[0.03] relative overflow-hidden group py-10 px-8">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-50" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-1000" />
        
        <form onSubmit={handleLogin} className="space-y-8 relative z-10">
          <div className="space-y-3 text-center">
            <h2 className="text-4xl font-black text-text-main tracking-tighter">Access Elite</h2>
            <p className="text-text-muted font-medium text-sm">Secure corporate shuttle authentication</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-red-200 leading-relaxed">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <Input
              label="Corporate Email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              required
              className="h-14 bg-white/[0.02] border-white/[0.05] focus:bg-white/[0.04] transition-all"
            />
            <div className="space-y-2">
              <Input
                label="Secure Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                required
                className="h-14 bg-white/[0.02] border-white/[0.05] focus:bg-white/[0.04] transition-all"
              />
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => alert('Password reset link sent to your corporate email.')}
                  className="text-[10px] font-black text-primary uppercase tracking-[0.15em] hover:text-primary-dark transition-colors py-1"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <Button 
              type="submit" 
              loading={isLoading}
              loadingText="Logging in..."
              className="w-full h-14 text-lg font-black uppercase tracking-widest group shadow-[0_10px_30px_rgba(34,197,94,0.15)]"
            >
              Authenticate
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-text-dim font-bold uppercase tracking-wider mb-2">
              Protected by Enterprise Security
            </p>
            <p className="text-xs text-text-dim font-bold uppercase tracking-wider">
              Don't have an account? {' '}
              <Link to="/signup" className="text-primary hover:text-primary-dark transition-colors">Sign Up</Link>
            </p>
          </div>

        </form>
      </Card>
    </div>
  );
};

export default LoginPage;

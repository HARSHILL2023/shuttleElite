import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import SEO from '../components/SEO';

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsSuccess(false);

    // Basic Validation
    if (!name || !email || !password) {
      setError('Please fill in all security fields.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.message || "Registration failed. Please check your details.");
      }
    } catch (err) {
      setError("Connection error: Unable to reach the security server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <SEO title="Elite Enlistment" description="Join the ShuttleElite network. Exclusive corporate mobility for top-tier professionals." />
      <Card className="w-full max-w-[440px] shadow-[0_0_80px_rgba(0,0,0,0.6)] border-white/[0.03] relative overflow-hidden group py-10 px-8">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-50" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-1000" />

        <form onSubmit={handleSignup} className="space-y-8 relative z-10">
          <div className="space-y-3 text-center">
            <h2 className="text-4xl font-black text-text-main tracking-tighter">Join Elite</h2>
            <p className="text-text-muted font-medium text-sm">Create your secure corporate identity</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-red-200 leading-relaxed">{error}</p>
            </div>
          )}

          {isSuccess && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-primary-light leading-relaxed">Account created successfully! Redirecting to login...</p>
            </div>
          )}

          <div className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              required
              className="h-14 bg-white/[0.02] border-white/[0.05] focus:bg-white/[0.04] transition-all"
            />
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
          </div>

          <div className="space-y-5">
            <Button
              type="submit"
              loading={isLoading}
              loadingText="Creating account..."
              className="w-full h-14 text-lg font-black uppercase tracking-widest group shadow-[0_10px_30px_rgba(34,197,94,0.15)]"
            >
              Create Account
              {!isLoading && <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />}
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-text-dim font-bold uppercase tracking-wider">
              Already have an account? {' '}
              <Link to="/" className="text-primary hover:text-primary-dark transition-colors">Sign In</Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SignupPage;

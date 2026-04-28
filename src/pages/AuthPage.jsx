import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden">
      {/* Left Side (Blue Welcome Panel) */}
      <div className="hidden md:flex flex-col justify-center w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white px-16 relative">
        {/* Soft abstract circular background shapes */}
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-15%] w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="z-10 relative">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 drop-shadow-sm">
            WELCOME
          </h1>
          <h2 className="text-2xl font-medium mb-6 text-blue-100/90 leading-tight">
            Smart Financial Management Platform
          </h2>
          <p className="text-blue-100/70 text-lg leading-relaxed max-w-md font-light">
            Streamline your business operations, track financials with precision, and manage client relationships seamlessly all in one secure place.
          </p>
        </div>
      </div>

      {/* Right Side (Login Card) */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 md:p-12 relative bg-slate-50">
        <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 relative z-10 transition-all duration-300">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Sign In</h2>
            <p className="text-slate-500 text-sm">Welcome back! Please enter your details.</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  id="email" 
                  type="email" 
                  placeholder="name@company.com" 
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-800 bg-slate-50/50 hover:bg-white focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-800 bg-slate-50/50 hover:bg-white focus:bg-white"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pb-2">
              <div className="flex items-center">
                <input 
                  id="remember-me" 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer transition-colors"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer hover:text-slate-800 transition-colors">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <a href="#" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

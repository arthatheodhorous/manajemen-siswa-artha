"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  const handleFillDemo = () => {
    setEmail("admin@sekolah.com");
    setPassword("admin123");
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Cek di tabel 'users' Supabase
      const { data: dbUser, error: dbError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email.toLowerCase().trim())
        .eq("password", password)
        .maybeSingle();

      if (dbUser) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", dbUser.email);
        localStorage.setItem("userName", dbUser.name || "Admin Sekolah");
        router.push("/dashboard");
        return;
      }

      // 2. Cek via Supabase Auth
      const { data: authData } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (authData?.user) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", authData.user.email || email);
        localStorage.setItem("userName", authData.user.user_metadata?.name || "Admin Sekolah");
        router.push("/dashboard");
        return;
      }

      // 3. Fallback Admin Demo
      if (email.toLowerCase().trim() === "admin@sekolah.com" && password === "admin123") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", "Admin Sekolah");
        router.push("/dashboard");
        return;
      }

      // 4. Fallback Local Storage
      const registeredUsersStr = localStorage.getItem("registeredUsers");
      const registeredUsers = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];
      const localUser = registeredUsers.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
      );

      if (localUser) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", localUser.email);
        localStorage.setItem("userName", localUser.name);
        router.push("/dashboard");
      } else {
        setError("Email atau password salah.");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDemoAccount = async () => {
    setIsLoading(true);
    setError("");
    setEmail("admin@sekolah.com");
    setPassword("admin123");

    // Otomatis simpan ke Supabase jika belum ada
    try {
      await supabase.from("users").upsert(
        { name: "Admin Sekolah", email: "admin@sekolah.com", password: "admin123", role: "admin" },
        { onConflict: "email" }
      );
    } catch (e) {
      console.log("Upsert demo admin skipped/errored", e);
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", "admin@sekolah.com");
    localStorage.setItem("userName", "Admin Sekolah");
    router.push("/dashboard");
  };


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-tr from-[#eef2f7] to-[#e4ebf5] p-4 font-sans">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_rgba(100,116,139,0.15)] border border-slate-100 flex flex-col items-center">
        {/* User Icon Header */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-5">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>

        {/* Header Text */}
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight text-center">
          Welcome Back
        </h1>
        <p className="text-slate-500 text-sm mt-1 text-center">
          Sign in to your account
        </p>

        {/* Demo Credentials Pill */}
        <button
          type="button"
          onClick={handleFillDemo}
          className="mt-5 w-full bg-slate-50 border border-slate-100 py-2.5 px-4 rounded-xl text-xs text-slate-600 hover:bg-slate-100/80 active:bg-slate-200/50 transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="font-medium">Akun demo:</span>
          <span className="text-blue-600 font-semibold underline decoration-2 decoration-blue-200">
            admin@sekolah.com
          </span>
          <span className="text-slate-400">/</span>
          <span className="text-blue-600 font-semibold underline decoration-2 decoration-blue-200">
            admin123
          </span>
          <span className="text-slate-400 text-[10px]">(Klik untuk isi)</span>
        </button>

        {error && (
          <div className="mt-4 w-full bg-red-50 text-red-600 text-xs py-2.5 px-4 rounded-xl border border-red-100 text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full mt-6 flex flex-col gap-5">
          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 ml-1">
              Email
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200 shadow-sm placeholder-slate-400"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 ml-1">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200 shadow-sm placeholder-slate-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white rounded-2xl py-3.5 font-semibold text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition duration-200 disabled:opacity-75 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* Secondary Button */}
          <button
            type="button"
            onClick={handleUseDemoAccount}
            disabled={isLoading}
            className="w-full bg-[#f0f6ff] text-blue-600 rounded-2xl py-3.5 font-semibold text-sm border border-blue-100 hover:bg-blue-100/50 transition duration-200 disabled:opacity-75 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
          >
            Use Demo Account (admin@sekolah.com)
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-8 text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

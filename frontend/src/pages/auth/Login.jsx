import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../../context/UserContext";
import { Link} from "react-router-dom";
import { assets } from "../../assets/assets";

export const Login = () => {

    const [isDragging, setIsDragging] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3000/api/auth/google'; 
    };

    const {
        loading,
        login,
        state,
        name,
        email,
        password,
        image,
        setState,
        setName,
        setEmail,
        setPassword,
        setImage,
    } = useContext(UserContext);

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-[#263238] border border-[#1E88E5]/30 rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    {state === "signUp" ? "Create Account" : "Welcome Back"}
                </h2>

                <form className="flex flex-col" onSubmit={login} encType="multipart/form-data">
                    {state === "signUp" && (
                        <>
                            <div className="flex items-center gap-4 mb-4">
                                <div
                                    className={`relative flex items-center justify-center border-2 rounded-xl w-16 h-16 overflow-hidden
                                    ${isDragging ? "border-yellow-400 bg-white/10" : "border-[#1E88E5]/40 bg-[#37474F]/40"}`}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setIsDragging(false);
                                        const file = e.dataTransfer.files[0];
                                        if (file && file.type.startsWith("image/")) {
                                            setImage(file);
                                        } else {
                                            toast.error("Please drop a valid image file", { position: "top-center" });
                                        }
                                    }}
                                >
                                    <label htmlFor="image" className="cursor-pointer absolute inset-0 flex items-center justify-center">
                                        <img
                                            loading="lazy"
                                            className="w-full h-full object-cover"
                                            src={image ? URL.createObjectURL(image) : assets.upload}
                                            alt="Upload"
                                        />
                                    </label>
                                    <input
                                        onChange={(e) => setImage(e.target.files[0])}
                                        type="file"
                                        id="image"
                                        name="image"
                                        hidden
                                        accept="image/*"
                                        required
                                    />
                                </div>
                                <input
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    type="text"
                                    placeholder="Full Name"
                                    className="flex-1 bg-[#37474F] placeholder:text-white/70 text-white border border-[#1E88E5]/40 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        placeholder="Email"
                        className="bg-[#37474F] placeholder:text-white/70 text-white border border-[#1E88E5]/40 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                        required
                    />

                    <div className="relative mb-4">
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type={`${showPassword ? "text" : "password"}`}
                            placeholder="Password"
                            className="w-full bg-[#37474F] placeholder:text-white/70 text-white border border-[#1E88E5]/40 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                            required
                        />
                        <span
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white/70 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>

                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            )}
                        </span>
                    </div>

                    {state === "login" && (
                        <div className="flex justify-end mb-4 text-sm">
                            <Link to="/auth/reset-password" className="text-white/70 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="bg-[#1E88E5] hover:bg-[#1565C0] transition text-white font-semibold py-2 rounded-md mb-4"
                    >
                        {state === "signUp" ? "Sign Up" : "Login"}
                    </button>

                    <button
                        onClick={() => handleGoogleLogin()}
                        type="button"
                        className="cursor-pointer flex items-center justify-center gap-2 bg-white text-black font-semibold py-1 rounded-md mb-4 hover:bg-gray-200 transition"
                    >
                        <img className="w-9" src={assets.google} alt="GOOGLE" />
                        <p>Continue with Google</p>
                    </button>

                    <div className="text-center text-white text-sm">
                        {state === "signUp" ? (
                            <p>
                                Already have an account?{' '}
                                <span
                                    onClick={() => setState("login")}
                                    className="text-yellow-300 cursor-pointer hover:underline"
                                >
                                    Login
                                </span>
                            </p>
                        ) : (
                            <p>
                                Don't have an account?{' '}
                                <span
                                    onClick={() => setState("signUp")}
                                    className="text-yellow-300 cursor-pointer hover:underline"
                                >
                                    Sign Up
                                </span>
                            </p>
                        )}
                    </div>
                </form>
            </div>
            {loading && (
                <div className=" bg-black/50 absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center w-full h-full ">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};

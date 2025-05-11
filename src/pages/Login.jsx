import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = React.useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Sign In</h2>
                {error && (
                    <p className="text-red-600 bg-red-50 p-3 rounded-md mb-6 text-sm text-center" role="alert">
                        {error}
                    </p>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                            placeholder="Enter your username"
                            required
                            aria-required="true"
                            aria-describedby={error ? "error-message" : undefined}
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                            placeholder="Enter your password"
                            required
                            aria-required="true"
                            aria-describedby={error ? "error-message" : undefined}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                        aria-label="Sign in"
                    >
                        Sign In
                    </button>
                </form>
                {/* <p className="mt-4 text-center text-sm text-gray-600">
                    Forgot your password?{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                        Reset it
                    </a>
                </p> */}
            </div>
        </div>
    );
};

export default Login;
import React, { useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
      const { user, logout, token, refreshAccessToken } = React.useContext(AuthContext);
      const [materials, setMaterials] = useState([]);
      const [skip, setSkip] = useState(0);
      const [hasMore, setHasMore] = useState(true);
      const [loading, setLoading] = useState(false);
      const limit = 20;
      const observer = useRef();

      const lastMaterialElementRef = React.useCallback(
        (node) => {
          if (loading) return;
          if (observer.current) observer.current.disconnect();
          observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
              setSkip((prev) => prev + limit);
            }
          });
          if (node) observer.current.observe(node);
        },
        [loading, hasMore]
      );

      const fetchMaterials = async (skip) => {
        setLoading(true);
        try {
          const filter = btoa(JSON.stringify({ Skip: skip, Limit: limit, Types: [1] }));
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/Materials/GetAll/?filter=${filter}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.status === 401) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
              return fetchMaterials(skip);
            } else {
              logout();
              return;
            }
          }

          const newMaterials = response.data.Materials;
          setMaterials((prev) => [...prev, ...newMaterials]);
          setHasMore(response.data.RemainingCount > 0);
        } catch (error) {
          console.error('Fetch materials error:', error);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        if (token) {
          fetchMaterials(skip);
        }
      }, [skip, token]);

      if (!user) return <Navigate to="/login" />;

      return (
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <div className="flex items-center">
                <img
                  src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${user.Avatar}`}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full mr-4"
                />
                <span>{user.FullName}</span>
                <button
                  onClick={logout}
                  className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold mb-4">Materials</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material, index) => (
                <div
                  key={index}
                  ref={index === materials.length - 1 ? lastMaterialElementRef : null}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
                >
                  <img
                    src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${material.CoverPhoto}`}
                    alt={material.Title}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                  <h3 className="text-lg font-semibold">{material.Title}</h3>
                  <p className="text-gray-600">{material.BrandName}</p>
                  <p className="text-gray-800 font-bold">
                    {user.Currency.Symbol}{material.SalesPriceInUsd.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            {loading && <p className="text-center mt-4">Loading...</p>}
            {!hasMore && !loading && (
              <p className="text-center mt-4 text-gray-500">No more materials to load.</p>
            )}
          </main>
        </div>
      );
    };

export default Dashboard;
import React from 'react';
import { Link } from 'react-router-dom';

export default function Auth() {
  return (
    <div className="flex gap-3">
      <Link
        to="/login"
        className="bg-white text-slate-900 px-3 py-2 rounded font-medium hover:bg-gray-300"
      >
        Login
      </Link>
      <Link
        to="/signup"
        className="bg-white text-slate-900 px-3 py-2 rounded font-medium hover:bg-gray-300"
      >
        Sign Up
      </Link>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";
import authService from "@/appwrite/auth";
import SignIn from "./SignIn";
import Logo from "./Logo";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  const [user, setUser] = useState(null);
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (authStatus) {
      fetchUser();
    }
  }, [authStatus]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  return (
    <>
      <header className="py-3 shadow">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center">
            <div className="mr-4">
              <Link to="/">
                <Logo />
              </Link>
            </div>
            <ul className="flex ml-auto gap-4">
              {authStatus && (
                <>
                  {user?.role === "recruiter" && (
                    <Link to="/post-job">
                      <Button variant="destructive" className="rounded-full">
                        <PenBox size={20} className="mr-2" />
                        Post a Job
                      </Button>
                    </Link>
                  )}
                  <div className="relative">
                    <button className="flex items-center">
                      <img
                        src={user.profileImage}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full"
                      />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                      <Link
                        to="/my-jobs"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        <BriefcaseBusiness size={15} className="mr-2" />
                        My Jobs
                      </Link>
                      <Link
                        to="/saved-jobs"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        <Heart size={15} className="mr-2" />
                        Saved Jobs
                      </Link>
                      <button
                        onClick={authService.logout}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
              {!authStatus && (
                <Button variant="outline" onClick={() => setShowSignIn(true)}>
                  Login
                </Button>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
};

export default Header;

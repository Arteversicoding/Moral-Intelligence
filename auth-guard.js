import { auth } from "./firebase-init.js";

// This script checks if a user is logged in.
// If not, it redirects to the login page.
// Add this script to every page you want to protect.

auth.onAuthStateChanged(function(user) {
  console.log('Auth state changed. User:', user); // Log user object
  if (!user) {
    // User is not logged in, redirect to login page.
    // We also check if we are already on the login or register page, to prevent an infinite redirect loop.
    const currentPath = window.location.pathname;
    console.log('Current path:', currentPath); // Log current path
    if (currentPath !== '/login.html' && currentPath !== '/register.html') {
      console.log('User not logged in and not on login/register page. Redirecting to login page.'); // Log redirect condition
      window.location.href = '/login.html';
    } else {
      console.log('User not logged in, but already on login/register page. No redirect.');
    }
  } else {
    console.log('User is logged in. No redirect.');
  }
});
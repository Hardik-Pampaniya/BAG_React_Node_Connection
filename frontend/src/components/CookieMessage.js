
import React, { useState } from 'react';

const CookieMessage = () => {
  const [accepted, setAccepted] = useState(localStorage.getItem('cookieAccepted'));

  const getUserId = () => {
    // Placeholder function to get the current user's ID from your authentication system
    // Replace this with your actual implementation
    // Example: return currentUser.id;
    return 'user123'; // Placeholder value
  };

  const handleAccept = () => {
    const userId = getUserId();
    localStorage.setItem(`cookieAccepted_${userId}`, 'true');
    setAccepted(true);
  };

  const handleLogout = () => {
    const userId = getUserId();
    localStorage.removeItem(`cookieAccepted_${userId}`);
    setAccepted(false);
  };

  const userId = getUserId();

  if (!userId) {
    // If user is not authenticated, don't render the message
    return null;
  }

  if (accepted) {
    return null; // If message has been accepted, don't render anything
  }

  return (
    <div className="cookie-message">
      This website uses cookies to ensure you get the best experience.
      <button onClick={handleAccept}>Accept</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default CookieMessage;

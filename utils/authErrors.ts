export const getAuthErrorMessage = (error: any) => {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters long.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/invalid-credential":
        return "Invalid credentials. Please try again.";
    default:
      return "Something went wrong. Please try again.";
  }
};

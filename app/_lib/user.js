// lib/user.js
import { getUser } from "./db"; // Your database access function

export async function getUserByEmail(email) {
  return getUser(email); // Adjust based on your database access method
}
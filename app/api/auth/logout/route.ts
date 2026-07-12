import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  // Clear the cookie by setting it with an expired date
  response.cookies.set('zomato_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  
  return response;
}

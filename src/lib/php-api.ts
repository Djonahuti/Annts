// Client-side helper to call PHP backend directly
const getPHPApiUrl = () => {
  // Use NEXT_PUBLIC_* variable (embedded at build time) or fallback
  if (typeof window !== 'undefined') {
    // Client-side: use the embedded variable or construct from current origin
    return process.env.NEXT_PUBLIC_PHP_API_URL || window.location.origin;
  }
  // Server-side (shouldn't happen in static export, but just in case)
  return process.env.NEXT_PUBLIC_PHP_API_URL || 'http://localhost';
};

export async function callPHPBackend(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const PHP_API_URL = getPHPApiUrl();
  const url = `${PHP_API_URL}${endpoint}`;
  
  // Forward headers from the original request
  const headers = new Headers(options.headers);
  
  // Get auth token from localStorage if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Set content type for JSON requests
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    return response;
  } catch (error) {
    console.error(`Error calling PHP backend ${url}:`, error);
    return new Response(
      JSON.stringify({ error: 'Failed to connect to PHP backend' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Alias for backward compatibility
export const proxyToPHP = callPHPBackend;
export default callPHPBackend;


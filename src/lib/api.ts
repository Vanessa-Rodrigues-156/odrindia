export const API_BASE_URL = "https://odrlab.com/backend/api";

//process.env.NEXT_PUBLIC_API_BASE_URL || 
export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  // Create headers object with proper typing
  const headers = new Headers(options.headers || {});
  
  // Add auth token if available
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
    console.log(`API Request to ${path}: Using token for authentication`);
  } else {
    console.log(`API Request to ${path}: No auth token available`);
  }

  // Set Content-Type header if needed
  if (
    ((options.method && options.method !== 'GET') || options.body) && 
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  try {
    console.log(`Making API request to: ${API_BASE_URL}${path}`);
    const response = await fetch(`${API_BASE_URL}${path}`, { 
      ...options, 
      headers,
      credentials: 'same-origin' 
    });
    
    console.log(`API Response from ${path}: Status ${response.status}`);
    
    if (response.status === 401) {
      console.warn(`Unauthorized response from ${path}`);
      if (path !== '/auth/login' && path !== '/auth/session' && token && typeof window !== "undefined") {
        console.warn('Session expired or invalid token - clearing token');
        localStorage.removeItem('token');
      }
    }
    
    return response;
  } catch (err) {
    console.error(`Network error in apiFetch to ${path}:`, err);
    throw err;
  }
}

export {};

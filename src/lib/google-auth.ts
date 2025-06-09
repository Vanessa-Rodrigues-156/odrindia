/**
 * Google Authentication Utility
 * Provides reusable functions for Google OAuth integration
 */

// Google OAuth Integration
export interface GoogleUser {
  email: string;
  name: string;
  picture?: string;
}

/**
 * Initialize Google OAuth
 * @param onSuccess Callback function to execute when Google sign-in is successful
 * @param onError Callback function to execute when Google sign-in encounters an error
 */
export async function initializeGoogleAuth(
  onSuccess: (googleUser: GoogleUser) => void,
  onError: (error: Error) => void
): Promise<void> {
  try {
    if (typeof window === 'undefined' || !window.google) {
      throw new Error("Google OAuth is not available");
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new Error("Google Client ID is not configured");
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: any) => {
        try {
          if (!response.credential) {
            throw new Error("No credential returned from Google");
          }

          // Decode the JWT token to get user info
          const jwt = response.credential;
          const payload = parseJwt(jwt);

          if (!payload || !payload.email) {
            throw new Error("Invalid Google user data");
          }

          const googleUser: GoogleUser = {
            email: payload.email,
            name: payload.name,
            picture: payload.picture
          };

          onSuccess(googleUser);
        } catch (error) {
          if (error instanceof Error) {
            onError(error);
          } else {
            onError(new Error("Unknown Google sign-in error"));
          }
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true
    });

    // Trigger the Google sign-in prompt
    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        onError(new Error("Google sign-in prompt was not displayed or was skipped"));
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      onError(error);
    } else {
      onError(new Error("Failed to initialize Google OAuth"));
    }
  }
}

/**
 * Parse JWT token payload
 */
function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(payload);
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
}

/**
 * Render a Google sign-in button in the specified container
 */
export function renderGoogleButton(containerId: string, onClick: () => void): void {
  if (typeof window === 'undefined' || !window.google) {
    console.error("Google OAuth is not available");
    return;
  }

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID '${containerId}' not found`);
    return;
  }

  // Clear the container first
  container.innerHTML = '';
  
  window.google.accounts.id.renderButton(
    container,
    {
      theme: "outline",
      size: "large",
      width: container.offsetWidth,
      text: "signup_with",
    }
  );

  // Add click handler to the container
  container.addEventListener('click', onClick);
}

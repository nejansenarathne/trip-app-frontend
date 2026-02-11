import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const projectId = Constants.expoConfig?.extra?.eas?.projectId;

// put your real client ids here or env
const ANDROID =
  "127516239222-u0ovpru2q91d814g5ms2omhcpbl3tc2a.apps.googleusercontent.com";
const IOS =
  "127516239222-u0ovpru2q91d814g5ms2omhcpbl3tc2a.apps.googleusercontent.com";
const WEB =
  "127516239222-u0ovpru2q91d814g5ms2omhcpbl3tc2a.apps.googleusercontent.com";

const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true,
  projectId,
});

console.log("✅ projectId:", projectId);
console.log("✅ Redirect URI:", redirectUri);

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: WEB,
    androidClientId: ANDROID,
    iosClientId: IOS,
    webClientId: WEB,
    scopes: ["openid", "profile", "email"],
    responseType: "id_token",
    redirectUri,
  });

  const getGoogleTokenFromResponse = () => {
    if (response?.type !== "success") return null;
    return (
      response?.authentication?.idToken ||
      response?.authentication?.accessToken ||
      null
    );
  };

  return { request, response, promptAsync, getGoogleTokenFromResponse };
};

import { useSignUp, useSignIn } from "@clerk/clerk-expo";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../Utils/Colors";

import * as AuthSession from "expo-auth-session";

export default function Loginx() {
  const { isLoaded, signIn, setSession } = useSignIn();
  const { signUp } = useSignUp();
  if (!isLoaded) return null;

  const handleSignInWithDiscordPress = async () => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        path: "/oauth-native-callback",
      });

      // Choose your OAuth provider, based upon your instance.
      await signIn.create({
        strategy: "oauth_google",
        redirectUrl,
      });

      const {
        firstFactorVerification: { externalVerificationRedirectURL },
      } = signIn;

      if (!externalVerificationRedirectURL)
        throw "Something went wrong during the OAuth flow. Try again.";

      const authResult = await AuthSession.startAsync({
        authUrl: externalVerificationRedirectURL.toString(),
        returnUrl: redirectUrl,
      });

      if (authResult.type !== "success") {
        throw "Something went wrong during the OAuth flow. Try again.";
      }

      // Get the rotatingTokenNonce from the redirect URL parameters
      const { rotating_token_nonce: rotatingTokenNonce } = authResult.params;

      await signIn.reload({ rotatingTokenNonce });

      const { createdSessionId } = signIn;

      if (createdSessionId) {
        // If we have a createdSessionId, then auth was successful
        await setSession(createdSessionId);
      } else {
        // If we have no createdSessionId, then this is a first time sign-in, so
        // we should process this as a signUp instead
        // Throw if we're not in the right state for creating a new user
        if (
          !signUp ||
          signIn.firstFactorVerification.status !== "transferable"
        ) {
          throw "Something went wrong during the Sign up OAuth flow. Please ensure that all sign up requirements are met.";
        }

        console.log(
          "Didn't have an account transferring, following through with new account sign up"
        );

        // Create user
        await signUp.create({ transfer: true });
        await signUp.reload({
          rotatingTokenNonce: authResult.params.rotating_token_nonce,
        });
        await setSession(signUp.createdSessionId);
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      console.log("error signing in", err);
    }
  };

  return (
    <View
      style={{
        alignItems: "center",
      }}
    >
      <Image
        source={require("./../../../assets/images/login.jpg")}
        style={styles.loginImage}
      />
      <View style={styles.subContainer}>
        <Text
          style={{ fontSize: 27, color: Colors.WHITE, textAlign: "center" }}
        >
          Let's Find{" "}
          <Text style={{ fontWeight: "bold" }}>
            Professional Cleaning and repair Service
          </Text>
        </Text>
        <Text
          style={{
            fontSize: 17,
            color: Colors.WHITE,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Best App To Find Best Services Near You wich deliver you a
          professional service
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignInWithDiscordPress}
        >
          <Text
            style={{ textAlign: "center", fontSize: 17, color: Colors.PRIMARY }}
          >
            Let's Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginImage: {
    padding: 100,
    width: 300,
    height: 450,
    marginTop: 70,
    borderWidth: 4,
    borderColor: Colors.BLACK,
    borderRadius: 15,
  },
  subContainer: {
    width: "100%",
    backgroundColor: Colors.PRIMARY,
    height: "70%",
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    color: "red",
  },
  button: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    borderRadius: 99,
    marginTop: 20,
  },
});

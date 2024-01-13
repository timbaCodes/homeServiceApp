import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Loginx from "./App/Screens/LoginScreen/Loginx";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";

export default function App() {
  return (
    <ClerkProvider publishableKey="pk_test_ZW5nYWdpbmctb3Bvc3N1bS0zMi5jbGVyay5hY2NvdW50cy5kZXYk">
      <View style={styles.container}>
        <SignedIn>
          <Text>You are Signed in</Text>
        </SignedIn>
        <SignedOut>
          <Loginx />
        </SignedOut>
        <StatusBar style="auto" />
      </View>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
});

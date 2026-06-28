import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  boxTop: {
    marginTop: 80,
    marginEnd: 0,
    flex: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  boxMid: {
    flex: 3,
    width: "100%",
    paddingHorizontal: 37,
    justifyContent: "center",
    gap: 6,
  },
  boxBottom: {
    flex: 2,
    width: "100%",
    paddingHorizontal: 37,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 40,
    gap: 16,
  },
  logo: {
    width: 250,
    height: 310,
  },
  titleInput: {
    color: "#fff",
    fontSize: 14,
    marginTop: 10,
    marginLeft: 5,
  },
  boxInput: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#333",
    backgroundColor: "#111",
    paddingHorizontal: 15,
    justifyContent: "center",
    marginTop: 4,
  },
  input: {
    color: "#fff",
    fontSize: 14,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#00FFD1",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  registerText: {
    color: "#aaa",
    fontSize: 14,
  },
  registerLink: {
    color: "#00FFD1",
    fontSize: 14,
    fontWeight: "bold",
  },
  forgotContainer: {
    alignSelf: "flex-end",
    marginTop: 8,
    marginRight: 5,
  },
  forgotText: {
    color: "#00FFD1",
    fontSize: 13,
  },
  errorText: {
    color: "#FF6666",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default style;

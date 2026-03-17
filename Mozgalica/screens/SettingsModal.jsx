import React, { useContext } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LanguageContext } from "@/context/LanguageContext";
import { useLanguage } from "@/context/LanguageContext";
import { Ionicons } from "@expo/vector-icons";


const SettingsModal = ({ visible, onClose, game, transparent }) => {
  const { language, setLanguage, t } = useLanguage();
  //const { language, setLanguage } = {};

  const rules = {
  "Memory": t("memory"),
  "Tic-Tac-Toe": t("ttt"),
  "2048": t("game2048"),
};

  return (
    <Modal visible={visible} 
            transparent={transparent}
            animationType="slide"
            onRequestClose={onClose}
        >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close" size={34} color="black" />
          </TouchableOpacity>

          <Text style={styles.title}>{t("settings")}</Text>

          {/* Izbor jezika */}
          <Text style={styles.label}>{t("language")}</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btn, language === "sr" && styles.active]}
              onPress={() => setLanguage("sr")}
            >
              <Text>SR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, language === "en" && styles.active]}
              onPress={() => setLanguage("en")}
            >
              <Text>EN</Text>
            </TouchableOpacity>
          </View>

          {/* Pravila igre */}
          { game === "" ? <></> : (
            <View>
                <Text style={styles.label}>{t("rules")}</Text>
                <Text style={styles.rules}>{rules[game]}</Text>
            </View>
          )}

          {/* Dugme za zatvaranje */}
          {/* <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>{t("close")}</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "85%",
    position: 'relative',
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    borderRadius: 20,
    //backgroundColor: "#eee",
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 20, 
    marginRight: 60,
    //borderRadius: 20,
    //backgroundColor: "#eee",
  },
  label: { fontSize: 18, marginTop: 10, marginBottom: 5 },
  row: { flexDirection: "row", gap: 10 },
  btn: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 60,
    alignItems: "center",
  },
  active: { backgroundColor: "#ddd" },
  rules: { fontSize: 16, marginVertical: 10 },
  closeBtn: {
    backgroundColor: "#347433",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  closeText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default SettingsModal;
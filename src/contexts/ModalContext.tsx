import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode, type ComponentType } from "react";
import { View, Pressable, Animated, StyleSheet, Dimensions } from "react-native";

type ModalEntry = {
  id: number;
  Component: ComponentType<any>;
  props: Record<string, any>;
};

type ModalContextType = {
  openModal: <P extends Record<string, any>>(Component: ComponentType<P>, props?: P) => number;
  closeModal: (id?: number) => void;
};

const ModalContext = createContext<ModalContextType>({
  openModal: () => 0,
  closeModal: () => {},
});

let nextModalId = 0;

function ModalOverlay({ entry, onClose }: { entry: ModalEntry; onClose: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(Dimensions.get("window").height)).current;

  const animateOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: Dimensions.get("window").height, duration: 250, useNativeDriver: true }),
    ]).start(onClose);
  }, [onClose]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const { Component, props } = entry;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.5)", opacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={animateOut} />
      </Animated.View>
      <Animated.View style={[styles.modalContent, { transform: [{ translateY }] }]}>
        <Component {...props} onClose={animateOut} />
      </Animated.View>
    </View>
  );
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalEntry[]>([]);

  const openModal = useCallback(<P extends Record<string, any>>(Component: ComponentType<P>, props?: P): number => {
    const id = ++nextModalId;
    setModals((prev) => [...prev, { id, Component, props: props ?? {} }]);
    return id;
  }, []);

  const closeModal = useCallback((id?: number) => {
    setModals((prev) => {
      if (id !== undefined) return prev.filter((m) => m.id !== id);
      return prev.slice(0, -1);
    });
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modals.map((entry) => (
        <ModalOverlay
          key={entry.id}
          entry={entry}
          onClose={() => closeModal(entry.id)}
        />
      ))}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}

const styles = StyleSheet.create({
  modalContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "90%",
  },
});

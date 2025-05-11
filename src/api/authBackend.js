import { auth } from "./firebaseConfig"; // Asegúrate de importar tu configuración de Firebase

export async function sendIdTokenToBackend() {
  try {
    const idToken = await auth.currentUser.getIdToken();
    const response = await fetch("https://tu-backend.com/verify-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      },
      body: JSON.stringify({ uid: auth.currentUser.uid })
    });

    if (response.ok) {
      console.log("Token validado en el backend");
    } else {
      console.error("Error al validar el token:", response.statusText);
    }
  } catch (error) {
    console.error("Error al obtener o enviar el token:", error);
  }
}
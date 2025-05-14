# StudyHub - Plataforma de Estudio y Práctica

[![GitHub](https://img.shields.io/badge/GitHub-Repositorio-blue?style=for-the-badge&logo=github)](https://github.com/tu-usuario/studyhub)

## 📚 Descripción
StudyHub es una plataforma educativa diseñada para que los estudiantes puedan practicar con exámenes y acceder a recursos de estudio de manera organizada y eficiente.

## 🚀 Características Principales
- Autenticación de usuarios (registro e inicio de sesión)
- Simulacros de exámenes por materias
- Seguimiento de progreso
- Interfaz intuitiva y amigable
- Diseño responsivo

## 🛠️ Tecnologías Utilizadas
- **Frontend**:
  - React 19
  - Vite
  - React Router DOM
  - Tailwind CSS
  - Ant Design
- **Autenticación**:
  - Firebase

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/studyhub.git
cd studyhub
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🏗️ Estructura del Proyecto
```
studyhub/
├── public/            # Archivos estáticos
├── src/
│   ├── assets/       # Recursos estáticos
│   ├── components/    # Componentes reutilizables
│   ├── context/       # Contextos de React
│   ├── data/          # Datos estáticos
│   ├── pages/         # Componentes de páginas
│   └── App.jsx        # Componente principal
├── backend/           # Código del servidor
├── .env.example       # Ejemplo de variables de entorno
└── package.json       # Dependencias y scripts
```

## 🚀 Despliegue
Puedes desplegar fácilmente este proyecto en plataformas como:
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

## 📄 Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.

## 🤝 Contribución
Las contribuciones son bienvenidas. Por favor, lee nuestras [guías de contribución](CONTRIBUTING.md) para más detalles.

## 📞 Contacto
¿Tienes preguntas? No dudes en abrir un issue en el repositorio.

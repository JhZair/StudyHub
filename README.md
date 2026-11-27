Proyecto de plataforma en la que estudiantes pueden practicar con exámenes y estudiar con recursos 
Link de página: https://studyhubfrontend-5pmm.onrender.com/
## Pipeline CI/CD

El pipeline está definido en `Jenkinsfile` y se ejecuta en Jenkins con cada commit a `development` (Poll SCM cada 2 minutos).

| Etapa | Herramienta | Estado |
|---|---|---|
| Construcción automática | npm + Vite | Implementada |
| Análisis estático | SonarQube | Implementada |
| Pruebas unitarias | Jest + Vitest | Implementada |
| Pruebas funcionales | Selenium WebDriver | Pendiente de integrar |
| Pruebas de API | Postman / Newman | Pendiente |
| Pruebas de rendimiento | Apache JMeter | Pendiente de integrar |
| Pruebas de seguridad | OWASP ZAP | Pendiente de integrar |
| Gestión de issues | GitHub Projects + Issues | Implementada |
| Despliegue | Docker Compose | En progreso |

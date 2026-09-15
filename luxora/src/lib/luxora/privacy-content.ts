export type LegalSection = { title: { en: string; es: string }; body: { en: string; es: string }; pendingReview?: boolean };

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    title: { en: "1. Introduction", es: "1. Introducción" },
    body: {
      en: "This Privacy Policy explains how Luxore collects, uses and protects information when beauty businesses and their clients use the Luxore platform — the dashboard, public booking pages, and related services.",
      es: "Esta Política de Privacidad explica cómo Luxore recopila, usa y protege la información cuando los negocios de belleza y sus clientes usan la plataforma Luxore — el panel, las páginas públicas de reservas y los servicios relacionados.",
    },
  },
  {
    title: { en: "2. Information We Collect", es: "2. Información que recopilamos" },
    body: {
      en: "We collect information you provide directly (like account and business details), information generated through your use of the platform (like appointments and payments), and limited technical information about the devices used to access it.",
      es: "Recopilamos información que nos proporcionas directamente (como los datos de tu cuenta y negocio), información generada por el uso de la plataforma (como citas y pagos), e información técnica limitada sobre los dispositivos usados para acceder a ella.",
    },
  },
  {
    title: { en: "3. Information Beauty Businesses Provide", es: "3. Información que proporcionan los negocios de belleza" },
    body: {
      en: "When you register a business, we collect your business name, type, contact details, address, staff, services and settings you configure, such as business hours and pricing.",
      es: "Al registrar un negocio, recopilamos el nombre, tipo, datos de contacto, dirección, personal, servicios y configuraciones que definas, como horario y precios.",
    },
  },
  {
    title: { en: "4. Information About Their Clients", es: "4. Información sobre sus clientes" },
    body: {
      en: "Businesses using Luxore may enter or import their own clients' information — such as name, contact details, appointment history, notes and forms — to run their business. This client information belongs to the business, not to Luxore.",
      es: "Los negocios que usan Luxore pueden ingresar o importar la información de sus propios clientes — como nombre, datos de contacto, historial de citas, notas y formularios — para administrar su negocio. Esta información de clientes pertenece al negocio, no a Luxore.",
    },
  },
  {
    title: { en: "5. Account Information", es: "5. Información de la cuenta" },
    body: {
      en: "We collect the email address and encrypted password (or equivalent authentication credentials) used to log in to Luxore, along with account activity needed for security and support.",
      es: "Recopilamos el correo electrónico y la contraseña cifrada (u otras credenciales de autenticación equivalentes) usados para iniciar sesión en Luxore, junto con la actividad de la cuenta necesaria para seguridad y soporte.",
    },
  },
  {
    title: { en: "6. Appointment and Booking Information", es: "6. Información de citas y reservas" },
    body: {
      en: "We process appointment details — services, staff, times, locations and status — to operate scheduling, availability and online booking.",
      es: "Procesamos los detalles de las citas — servicios, personal, horarios, ubicaciones y estado — para operar la agenda, disponibilidad y reservas en línea.",
    },
  },
  {
    title: { en: "7. Payment Information", es: "7. Información de pagos" },
    body: {
      en: "Card payments are processed by our payment provider (Stripe). Luxore does not store full card numbers or CVV codes — those are handled directly by the payment provider under its own security standards.",
      es: "Los pagos con tarjeta son procesados por nuestro proveedor de pagos (Stripe). Luxore no almacena números completos de tarjeta ni códigos CVV — esos son manejados directamente por el proveedor de pagos bajo sus propios estándares de seguridad.",
    },
  },
  {
    title: { en: "8. Communications", es: "8. Comunicaciones" },
    body: {
      en: "We process messages and consent records related to appointment confirmations, reminders and other business-to-client communications sent through the platform.",
      es: "Procesamos mensajes y registros de consentimiento relacionados con confirmaciones de citas, recordatorios y otras comunicaciones entre negocios y clientes enviadas a través de la plataforma.",
    },
  },
  {
    title: { en: "9. Device and Usage Information", es: "9. Información del dispositivo y de uso" },
    body: {
      en: "Like most web platforms, we collect limited technical information such as browser type, general device information, and pages visited, to keep the platform secure and functioning correctly.",
      es: "Como la mayoría de las plataformas web, recopilamos información técnica limitada, como tipo de navegador, información general del dispositivo, y páginas visitadas, para mantener la plataforma segura y funcionando correctamente.",
    },
  },
  {
    title: { en: "10. How We Use Information", es: "10. Cómo usamos la información" },
    body: {
      en: "We use the information described above to provide and improve the platform, process bookings and payments, communicate with businesses and their clients, maintain security, and comply with legal obligations.",
      es: "Usamos la información descrita arriba para proveer y mejorar la plataforma, procesar reservas y pagos, comunicarnos con los negocios y sus clientes, mantener la seguridad, y cumplir con obligaciones legales.",
    },
  },
  {
    title: { en: "11. Service Providers", es: "11. Proveedores de servicios" },
    body: {
      en: "We share information with service providers who help us operate the platform — such as hosting and database infrastructure and payment processing — under agreements that limit their use of that information to providing services to us.",
      es: "Compartimos información con proveedores de servicios que nos ayudan a operar la plataforma — como infraestructura de hosting y base de datos, y procesamiento de pagos — bajo acuerdos que limitan su uso de esa información a proveernos servicios.",
    },
  },
  {
    title: { en: "12. Payments", es: "12. Pagos" },
    body: {
      en: "Payment processing is handled by Stripe. Using Luxore's payment features means the relevant transaction information is also subject to Stripe's own privacy practices.",
      es: "El procesamiento de pagos es manejado por Stripe. Usar las funciones de pago de Luxore implica que la información relevante de la transacción también está sujeta a las prácticas de privacidad propias de Stripe.",
    },
  },
  {
    title: { en: "13. Communications / SMS / Email", es: "13. Comunicaciones / SMS / Correo" },
    body: {
      en: "Where a business enables client messaging, message delivery may rely on third-party email or SMS providers. Clients' consent preferences for these communications are recorded and respected.",
      es: "Cuando un negocio habilita la mensajería con clientes, el envío de mensajes puede depender de proveedores externos de correo o SMS. Las preferencias de consentimiento de los clientes para estas comunicaciones se registran y se respetan.",
    },
  },
  {
    title: { en: "14. Cookies and Similar Technologies", es: "14. Cookies y tecnologías similares" },
    body: {
      en: "Luxore uses necessary cookies to keep you logged in and to remember settings such as your selected language. Where analytics or marketing cookies are used, they are only loaded after you've given consent through the Cookie Preferences tool.",
      es: "Luxore usa cookies necesarias para mantener tu sesión iniciada y recordar configuraciones como el idioma seleccionado. Cuando se usan cookies de analítica o marketing, solo se cargan después de que des tu consentimiento a través de la herramienta de Preferencias de Cookies.",
    },
  },
  {
    title: { en: "15. Data Retention", es: "15. Retención de datos" },
    body: {
      en: "We retain information for as long as needed to provide the platform and for legitimate business or legal purposes, and delete or anonymize it when it's no longer needed.",
      es: "Conservamos la información durante el tiempo necesario para proveer la plataforma y para fines comerciales o legales legítimos, y la eliminamos o anonimizamos cuando ya no es necesaria.",
    },
  },
  {
    title: { en: "16. Data Security", es: "16. Seguridad de los datos" },
    body: {
      en: "Luxore uses industry-standard safeguards, including encrypted connections and database-level tenant isolation, so one business can never access another business's data. No system is perfectly secure, and we continue to invest in these protections.",
      es: "Luxore usa medidas de seguridad estándar de la industria, incluyendo conexiones cifradas y aislamiento de datos a nivel de base de datos, para que un negocio nunca pueda acceder a los datos de otro. Ningún sistema es perfectamente seguro, y seguimos invirtiendo en estas protecciones.",
    },
  },
  {
    title: { en: "17. Your Privacy Choices", es: "17. Tus opciones de privacidad" },
    body: {
      en: "You can manage cookie preferences at any time from the footer of our website, choose your language, and contact us to ask about the information associated with your account.",
      es: "Puedes administrar tus preferencias de cookies en cualquier momento desde el pie de página de nuestro sitio, elegir tu idioma, y contactarnos para preguntar sobre la información asociada a tu cuenta.",
    },
  },
  {
    title: { en: "18. Business Customers and Their Clients", es: "18. Negocios clientes y sus propios clientes" },
    body: {
      en: "When a beauty business uses Luxore to manage its own clients, that business acts as the data controller for its clients' information, and Luxore acts as its service provider. Requests about a specific client's information should go to the business that manages that client, who can reach Luxore support as needed.",
      es: "Cuando un negocio de belleza usa Luxore para administrar a sus propios clientes, ese negocio actúa como responsable de la información de sus clientes, y Luxore actúa como su proveedor de servicios. Las solicitudes sobre la información de un cliente específico deben dirigirse al negocio que lo administra, quien puede contactar al soporte de Luxore si es necesario.",
    },
  },
  {
    title: { en: "19. Children's Privacy", es: "19. Privacidad de menores" },
    body: {
      en: "Luxore is intended for business use by adults. We do not knowingly collect account information directly from children.",
      es: "Luxore está destinado al uso comercial por adultos. No recopilamos conscientemente información de cuenta directamente de menores de edad.",
    },
  },
  {
    title: { en: "20. Changes to This Policy", es: "20. Cambios a esta política" },
    body: {
      en: "We may update this Privacy Policy from time to time. Material changes will be reflected by updating the date at the top of this page.",
      es: "Podemos actualizar esta Política de Privacidad periódicamente. Los cambios importantes se reflejarán actualizando la fecha en la parte superior de esta página.",
    },
  },
  {
    title: { en: "21. Contact", es: "21. Contacto" },
    body: {
      en: "Questions about this Privacy Policy can be sent through our Contact page.",
      es: "Las preguntas sobre esta Política de Privacidad pueden enviarse a través de nuestra página de Contacto.",
    },
  },
];

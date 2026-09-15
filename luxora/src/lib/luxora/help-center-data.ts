/**
 * Help Center content. Each article is a simple {id, title, body} pair so
 * new ones can be added later without touching the page/search logic.
 * Only documents features that actually exist in the product today.
 */
export type HelpArticle = { id: string; title: { en: string; es: string }; body: { en: string; es: string } };
export type HelpCategory = { id: string; titleKey: string; title: { en: string; es: string }; articles: HelpArticle[] };

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: "getting-started",
    titleKey: "help_cat_getting_started",
    title: { en: "Getting Started", es: "Primeros pasos" },
    articles: [
      {
        id: "creating-your-account",
        title: { en: "Creating your Luxore account", es: "Crear tu cuenta de Luxore" },
        body: {
          en: "Sign up from the Luxore homepage with your business and owner information — you get a 30-day free trial with no credit card required.",
          es: "Regístrate desde la página principal de Luxore con la información de tu negocio y del propietario — obtienes 30 días de prueba gratis sin necesidad de tarjeta de crédito.",
        },
      },
      {
        id: "setting-up-your-business",
        title: { en: "Setting up your business", es: "Configurar tu negocio" },
        body: {
          en: "After registering, add your services, staff and locations from the dashboard. Everything you set up here drives your calendar and public booking page.",
          es: "Después de registrarte, agrega tus servicios, personal y ubicaciones desde el panel. Todo lo que configures aquí controla tu calendario y tu página pública de reservas.",
        },
      },
      {
        id: "setting-business-hours",
        title: { en: "Setting business hours", es: "Configurar el horario del negocio" },
        body: {
          en: "Set open/closed hours for each day of the week under Settings → Locations & Hours. These hours control which times can be booked, in-app and online.",
          es: "Configura horarios de apertura/cierre para cada día en Configuración → Ubicaciones y horarios. Estos horarios controlan qué horas se pueden reservar, dentro de la app y en línea.",
        },
      },
      {
        id: "adding-your-services",
        title: { en: "Adding your services", es: "Agregar tus servicios" },
        body: {
          en: "Create services with a name, category, duration and price under Services. Assign each service to the staff members qualified to perform it.",
          es: "Crea servicios con nombre, categoría, duración y precio en Servicios. Asigna cada servicio a los miembros del personal calificados para realizarlo.",
        },
      },
      {
        id: "adding-staff-members",
        title: { en: "Adding staff members", es: "Agregar miembros del personal" },
        body: {
          en: "Add each team member under Staff, with the services they perform and their availability. Every staff member gets their own place on the calendar.",
          es: "Agrega a cada miembro del equipo en Personal, con los servicios que realiza y su disponibilidad. Cada miembro del personal tiene su propio espacio en el calendario.",
        },
      },
    ],
  },
  {
    id: "booking-calendar",
    titleKey: "help_cat_booking_calendar",
    title: { en: "Booking & Calendar", es: "Reservas y calendario" },
    articles: [
      {
        id: "creating-an-appointment",
        title: { en: "Creating an appointment", es: "Crear una cita" },
        body: {
          en: "Double-click an open slot on the calendar (or tap it on mobile) to start a new appointment with a real client, service and staff member.",
          es: "Haz doble clic en un horario libre del calendario (o tócalo en el celular) para crear una nueva cita con un cliente, servicio y personal reales.",
        },
      },
      {
        id: "blocking-time",
        title: { en: "Blocking time", es: "Bloquear horarios" },
        body: {
          en: "Block time for lunch, meetings or time off from the same calendar action as creating an appointment. Blocked time is excluded from online booking automatically.",
          es: "Bloquea horarios para almuerzo, reuniones o tiempo libre desde la misma acción del calendario que crear una cita. El tiempo bloqueado se excluye automáticamente de las reservas en línea.",
        },
      },
      {
        id: "managing-availability",
        title: { en: "Managing availability", es: "Administrar la disponibilidad" },
        body: {
          en: "Availability is calculated automatically from business hours, staff schedules, service duration and existing appointments — no manual syncing needed.",
          es: "La disponibilidad se calcula automáticamente según el horario del negocio, los horarios del personal, la duración del servicio y las citas existentes — no requiere sincronización manual.",
        },
      },
      {
        id: "appointment-statuses",
        title: { en: "Appointment statuses", es: "Estados de las citas" },
        body: {
          en: "Appointments move through statuses like confirmed, completed and no-show, which also drive automations like review requests.",
          es: "Las citas pasan por estados como confirmada, completada e inasistencia, que también activan automatizaciones como solicitudes de reseñas.",
        },
      },
      {
        id: "online-booking",
        title: { en: "Online booking", es: "Reservas en línea" },
        body: {
          en: "Turn on online booking under Settings → Online Booking so clients can book themselves from your public Luxore page, 24/7.",
          es: "Activa las reservas en línea en Configuración → Reservas en línea para que tus clientes reserven solos desde tu página pública de Luxore, 24/7.",
        },
      },
    ],
  },
  {
    id: "clients",
    titleKey: "help_cat_clients",
    title: { en: "Clients", es: "Clientes" },
    articles: [
      {
        id: "adding-a-new-client",
        title: { en: "Adding a new client", es: "Agregar un nuevo cliente" },
        body: {
          en: "Add a client manually from the Clients page, or let the online booking wizard create one automatically when a new client books.",
          es: "Agrega un cliente manualmente desde la página de Clientes, o deja que el asistente de reservas en línea cree uno automáticamente cuando un cliente nuevo reserva.",
        },
      },
      {
        id: "importing-clients",
        title: { en: "Importing clients", es: "Importar clientes" },
        body: {
          en: "Import clients from a CSV file or your phone contacts under Clients → Import. Luxore detects likely duplicates by phone or email before importing.",
          es: "Importa clientes desde un archivo CSV o tus contactos telefónicos en Clientes → Importar. Luxore detecta posibles duplicados por teléfono o correo antes de importar.",
        },
      },
      {
        id: "client-profiles",
        title: { en: "Client profiles", es: "Perfiles de clientes" },
        body: {
          en: "Every client profile shows visit history, notes, allergies and preferences in one place, kept up to date automatically after each visit.",
          es: "Cada perfil de cliente muestra el historial de visitas, notas, alergias y preferencias en un solo lugar, actualizado automáticamente después de cada visita.",
        },
      },
      {
        id: "client-forms",
        title: { en: "Client forms", es: "Formularios de clientes" },
        body: {
          en: "Build custom intake and consent forms under Forms, and choose whether they're required on every visit or only the first one.",
          es: "Crea formularios personalizados de admisión y consentimiento en Formularios, y elige si son obligatorios en cada visita o solo en la primera.",
        },
      },
      {
        id: "allergies-and-notes",
        title: { en: "Allergies and notes", es: "Alergias y notas" },
        body: {
          en: "Allergy information entered on a client's form or profile shows as a clear warning banner whenever you open their profile.",
          es: "La información de alergias ingresada en el formulario o perfil de un cliente se muestra como una alerta clara cada vez que abres su perfil.",
        },
      },
    ],
  },
  {
    id: "payments",
    titleKey: "help_cat_payments",
    title: { en: "Payments", es: "Pagos" },
    articles: [
      {
        id: "understanding-luxore-payments",
        title: { en: "Understanding Luxore Payments", es: "Cómo funcionan los pagos en Luxore" },
        body: {
          en: "Luxore supports card payments (via Stripe), cash and other manual methods at checkout today. Tap to Pay and a dedicated terminal are coming soon.",
          es: "Luxore admite pagos con tarjeta (vía Stripe), efectivo y otros métodos manuales en el cobro hoy. Tap to Pay y una terminal dedicada llegarán pronto.",
        },
      },
      {
        id: "deposits",
        title: { en: "Deposits", es: "Depósitos" },
        body: {
          en: "Require a deposit on specific services. Unpaid deposits trigger a reminder and can automatically cancel the appointment if the deadline passes.",
          es: "Exige un depósito en servicios específicos. Los depósitos sin pagar activan un recordatorio y pueden cancelar la cita automáticamente si vence el plazo.",
        },
      },
      {
        id: "checkout",
        title: { en: "Checkout", es: "Cobro" },
        body: {
          en: "Check out an appointment from the calendar to charge services, retail products, apply deposits or discounts, and record the payment.",
          es: "Cobra una cita desde el calendario para cargar servicios, productos, aplicar depósitos o descuentos, y registrar el pago.",
        },
      },
      {
        id: "tips",
        title: { en: "Tips", es: "Propinas" },
        body: {
          en: "Add a tip at checkout as part of the total charged — it's recorded alongside the rest of that transaction.",
          es: "Agrega una propina al momento de cobrar como parte del total — se registra junto con el resto de esa transacción.",
        },
      },
      {
        id: "refunds",
        title: { en: "Refunds", es: "Reembolsos" },
        body: {
          en: "Refund a card payment from its transaction record under Payments. Refunds are reflected in your payment reports.",
          es: "Reembolsa un pago con tarjeta desde su registro de transacción en Pagos. Los reembolsos se reflejan en tus reportes de pagos.",
        },
      },
    ],
  },
  {
    id: "business-management",
    titleKey: "help_cat_business_management",
    title: { en: "Business Management", es: "Gestión del negocio" },
    articles: [
      {
        id: "inventory",
        title: { en: "Inventory", es: "Inventario" },
        body: {
          en: "Track retail products and stock levels under Inventory, with low-stock alerts before you run out mid-appointment.",
          es: "Controla productos de venta al público y niveles de existencias en Inventario, con alertas de bajo stock antes de quedarte sin producto a mitad de una cita.",
        },
      },
      {
        id: "staff",
        title: { en: "Staff", es: "Personal" },
        body: {
          en: "Manage every team member's services, schedule and role under Staff.",
          es: "Administra los servicios, horario y rol de cada miembro del equipo en Personal.",
        },
      },
      {
        id: "locations",
        title: { en: "Locations", es: "Ubicaciones" },
        body: {
          en: "Add more than one location under Settings → Locations & Hours, each with its own business hours.",
          es: "Agrega más de una ubicación en Configuración → Ubicaciones y horarios, cada una con su propio horario.",
        },
      },
      {
        id: "reports",
        title: { en: "Reports", es: "Reportes" },
        body: {
          en: "See real revenue, appointment and client reports under Reports, with a custom date range and CSV export.",
          es: "Consulta reportes reales de ingresos, citas y clientes en Reportes, con un rango de fechas personalizado y exportación a CSV.",
        },
      },
    ],
  },
  {
    id: "website-booking",
    titleKey: "help_cat_website_booking",
    title: { en: "Website & Online Booking", es: "Sitio web y reservas en línea" },
    articles: [
      {
        id: "customizing-your-website",
        title: { en: "Customizing your business website", es: "Personalizar tu sitio web" },
        body: {
          en: "Add your logo, cover image, brand color and tagline under Settings → Website, with a live preview as you edit.",
          es: "Agrega tu logo, imagen de portada, color de marca y eslogan en Configuración → Sitio web, con vista previa en vivo mientras editas.",
        },
      },
      {
        id: "online-booking-settings",
        title: { en: "Online booking settings", es: "Configuración de reservas en línea" },
        body: {
          en: "Control your booking window, minimum notice and buffer time under Settings → Online Booking. You can also set your public site's language (English, Spanish, or both).",
          es: "Controla la ventana de reservas, el aviso mínimo y el tiempo entre citas en Configuración → Reservas en línea. También puedes elegir el idioma de tu sitio público (inglés, español, o ambos).",
        },
      },
      {
        id: "branding",
        title: { en: "Branding", es: "Marca" },
        body: {
          en: "Choose which sections (like Team or Reviews) appear on your public page, and preview changes before they go live.",
          es: "Elige qué secciones (como Equipo o Reseñas) aparecen en tu página pública, y previsualiza los cambios antes de publicarlos.",
        },
      },
    ],
  },
  {
    id: "account",
    titleKey: "help_cat_account",
    title: { en: "Account", es: "Cuenta" },
    articles: [
      {
        id: "login",
        title: { en: "Login", es: "Inicio de sesión" },
        body: {
          en: "Log in with the email and password you registered with. If you're having trouble, contact support.",
          es: "Inicia sesión con el correo y contraseña con los que te registraste. Si tienes problemas, contacta a soporte.",
        },
      },
      {
        id: "password",
        title: { en: "Password", es: "Contraseña" },
        body: {
          en: "Password reset is handled through Supabase Auth's standard email-based flow.",
          es: "El restablecimiento de contraseña se maneja mediante el flujo estándar por correo de Supabase Auth.",
        },
      },
      {
        id: "subscription",
        title: { en: "Subscription", es: "Suscripción" },
        body: {
          en: "See your current plan and trial status under Settings → Subscription. You'll choose a plan once your free month ends.",
          es: "Consulta tu plan actual y el estado de tu prueba en Configuración → Suscripción. Elegirás un plan al terminar tu mes gratis.",
        },
      },
      {
        id: "language-settings",
        title: { en: "Language settings", es: "Configuración de idioma" },
        body: {
          en: "Change your dashboard's language under Settings → Business Profile. Your public site's language is set separately under Settings → Website.",
          es: "Cambia el idioma de tu panel en Configuración → Perfil del negocio. El idioma de tu sitio público se configura por separado en Configuración → Sitio web.",
        },
      },
    ],
  },
];

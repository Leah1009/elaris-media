export type Locale = "en" | "es";

/**
 * A hand-maintained dictionary rather than a translation library — the
 * dashboard is server-rendered per business, so each business only ever
 * needs one locale per request. Covers the chrome every business sees on
 * every page (nav, header, common actions) plus the highest-traffic
 * screens; less-visited settings pages remain English-only for now and can
 * be added to this table incrementally without touching how it's consumed.
 */
const dictionary = {
  // Chrome
  nav_dashboard: { en: "Dashboard", es: "Panel" },
  nav_calendar: { en: "Calendar", es: "Calendario" },
  nav_clients: { en: "Clients", es: "Clientes" },
  nav_messages: { en: "Messages", es: "Mensajes" },
  nav_business: { en: "Business", es: "Negocio" },
  nav_services: { en: "Services", es: "Servicios" },
  nav_staff: { en: "Staff", es: "Personal" },
  nav_inventory: { en: "Inventory", es: "Inventario" },
  nav_forms: { en: "Forms", es: "Formularios" },
  nav_waitlist: { en: "Waitlist", es: "Lista de espera" },
  nav_message_templates: { en: "Message Templates", es: "Plantillas de mensajes" },
  nav_money: { en: "Money", es: "Finanzas" },
  nav_checkout: { en: "Checkout / POS", es: "Cobro / Caja" },
  nav_payments: { en: "Payments", es: "Pagos" },
  nav_gift_cards: { en: "Gift Cards", es: "Tarjetas de regalo" },
  nav_memberships: { en: "Memberships", es: "Membresías" },
  nav_packages: { en: "Packages", es: "Paquetes" },
  nav_reports: { en: "Reports", es: "Reportes" },
  nav_growth: { en: "Growth", es: "Crecimiento" },
  nav_marketing: { en: "Marketing", es: "Marketing" },
  nav_promotions: { en: "Promotions", es: "Promociones" },
  nav_automations: { en: "Automations", es: "Automatizaciones" },
  nav_reviews: { en: "Reviews", es: "Reseñas" },
  nav_loyalty: { en: "Loyalty", es: "Fidelidad" },
  nav_online: { en: "Online", es: "En línea" },
  nav_website: { en: "Website", es: "Sitio web" },
  nav_online_booking: { en: "Online Booking", es: "Reservas en línea" },
  nav_online_store: { en: "Online Store", es: "Tienda en línea" },
  nav_soon: { en: "Soon", es: "Pronto" },
  profile: { en: "Profile", es: "Perfil" },
  settings: { en: "Settings", es: "Configuración" },
  log_out: { en: "Log out", es: "Cerrar sesión" },
  admin: { en: "Admin", es: "Administración" },
  back: { en: "Back", es: "Atrás" },
  menu: { en: "Menu", es: "Menú" },
  days_remaining: { en: "days remaining in your free trial.", es: "días restantes de tu prueba gratis." },
  day_remaining: { en: "day remaining in your free trial.", es: "día restante de tu prueba gratis." },

  // Common actions
  save: { en: "Save", es: "Guardar" },
  save_changes: { en: "Save Changes", es: "Guardar cambios" },
  cancel: { en: "Cancel", es: "Cancelar" },
  edit: { en: "Edit", es: "Editar" },
  delete: { en: "Delete", es: "Eliminar" },
  add: { en: "Add", es: "Agregar" },
  new: { en: "New", es: "Nuevo" },
  active: { en: "Active", es: "Activo" },
  inactive: { en: "Inactive", es: "Inactivo" },
  loading: { en: "Loading…", es: "Cargando…" },

  // Dashboard home
  dashboard_title: { en: "Dashboard", es: "Panel" },
  welcome: { en: "Welcome,", es: "Bienvenido," },
  trial_days_left: { en: "left in your free trial.", es: "restantes de tu prueba gratis." },
  trial_ended_inline: { en: "Your trial has ended.", es: "Tu prueba ha terminado." },
  trial_ended_title: { en: "Your free trial has ended", es: "Tu prueba gratis ha terminado" },
  trial_ended_body: {
    en: "Your business information is safe. Choose a Luxore plan to continue managing your appointments, clients and business.",
    es: "La información de tu negocio está segura. Elige un plan de Luxore para seguir gestionando tus citas, clientes y negocio.",
  },
  view_plans: { en: "View Plans", es: "Ver planes" },
  todays_appointments: { en: "Today's Appointments", es: "Citas de hoy" },
  completed: { en: "completed", es: "completadas" },
  todays_expected_revenue: { en: "Today's Expected Revenue", es: "Ingresos esperados hoy" },
  scheduled_value_note: {
    en: "Scheduled value, not yet collected payments",
    es: "Valor programado, pagos aún no cobrados",
  },
  new_clients_today: { en: "New Clients Today", es: "Nuevos clientes hoy" },
  todays_schedule: { en: "Today's Schedule", es: "Agenda de hoy" },
  view_calendar: { en: "View Calendar", es: "Ver calendario" },
  no_appointments_today: { en: "No appointments scheduled for today.", es: "No hay citas programadas para hoy." },
  this_week_revenue: { en: "This Week's Revenue", es: "Ingresos de esta semana" },
  total_clients: { en: "Total Clients", es: "Clientes totales" },

  // Calendar
  calendar_title: { en: "Calendar", es: "Calendario" },
  prev: { en: "Prev", es: "Anterior" },
  today: { en: "Today", es: "Hoy" },
  next: { en: "Next", es: "Siguiente" },
  new_appointment: { en: "New Appointment", es: "Nueva cita" },

  // Clients
  clients_title: { en: "Clients", es: "Clientes" },
  new_client: { en: "New Client", es: "Nuevo cliente" },
  import_clients: { en: "Import Clients", es: "Importar clientes" },
  add_client: { en: "Add Client", es: "Agregar cliente" },
  search_clients_placeholder: { en: "Search by name, phone or email", es: "Buscar por nombre, teléfono o correo" },
  col_name: { en: "Name", es: "Nombre" },
  col_contact: { en: "Contact", es: "Contacto" },
  col_visits: { en: "Visits", es: "Visitas" },
  col_last_visit: { en: "Last Visit", es: "Última visita" },
  no_clients_search: { en: "No clients match your search.", es: "Ningún cliente coincide con tu búsqueda." },
  no_clients_yet: { en: "No clients yet. Add your first client.", es: "Aún no hay clientes. Agrega tu primer cliente." },

  // Services
  services_title: { en: "Services", es: "Servicios" },
  new_service: { en: "New Service", es: "Nuevo servicio" },
  add_service: { en: "Add Service", es: "Agregar servicio" },
  col_category: { en: "Category", es: "Categoría" },
  col_duration: { en: "Duration", es: "Duración" },
  col_price: { en: "Price", es: "Precio" },
  col_status: { en: "Status", es: "Estado" },
  no_services_yet: {
    en: "No services yet. Add your first service to start building appointments.",
    es: "Aún no hay servicios. Agrega tu primer servicio para empezar a crear citas.",
  },

  // Forms
  forms_title: { en: "Client Forms", es: "Formularios de clientes" },
  new_form: { en: "New Form", es: "Nuevo formulario" },

  // Messages
  messages_title: { en: "Messages", es: "Mensajes" },

  // Settings
  settings_title: { en: "Settings", es: "Configuración" },
  settings_business_profile: { en: "Business Profile", es: "Perfil del negocio" },
  settings_business_profile_desc: {
    en: "Name, contact info, timezone, tax rate.",
    es: "Nombre, información de contacto, zona horaria, tasa de impuesto.",
  },
  settings_locations_hours: { en: "Locations & Hours", es: "Ubicaciones y horarios" },
  settings_locations_hours_desc: {
    en: "Manage locations and business hours.",
    es: "Administra ubicaciones y horarios de atención.",
  },
  settings_online_booking: { en: "Online Booking", es: "Reservas en línea" },
  settings_online_booking_desc: {
    en: "Booking window, notice, buffer time.",
    es: "Ventana de reservas, aviso previo, tiempo entre citas.",
  },
  settings_website: { en: "Website", es: "Sitio web" },
  settings_website_desc: { en: "Branding shown on your public page.", es: "Imagen de marca de tu página pública." },
  settings_payments: { en: "Payments", es: "Pagos" },
  settings_payments_desc: { en: "Connect Stripe for card payments.", es: "Conecta Stripe para pagos con tarjeta." },
  settings_subscription: { en: "Subscription", es: "Suscripción" },
  settings_subscription_desc: { en: "Your Luxore plan.", es: "Tu plan de Luxore." },

  // Reports
  reports_title: { en: "Reports", es: "Reportes" },

  // Public nav (landing, unauthenticated)
  nav_log_in: { en: "Log In", es: "Iniciar sesión" },
  nav_start_free: { en: "Start Free", es: "Comenzar gratis" },
  nav_features: { en: "Features", es: "Funciones" },
  nav_how_it_works: { en: "How It Works", es: "Cómo funciona" },
  nav_about: { en: "About", es: "Acerca de" },
  start_free_month_cta: { en: "Start Your Free Month", es: "Comienza tu mes gratis" },

  // Hero
  hero_eyebrow: { en: "The all-in-one platform for beauty businesses", es: "La plataforma todo en uno para negocios de belleza" },
  hero_headline: { en: "Built for beauty businesses that expect more.", es: "Hecho para negocios de belleza que esperan más." },
  hero_subhead: {
    en: "Run your entire beauty business from one beautifully connected platform — bookings, clients, payments, inventory, marketing and your own website.",
    es: "Administra todo tu negocio de belleza desde una sola plataforma conectada — reservas, clientes, pagos, inventario, marketing y tu propio sitio web.",
  },
  hero_trial_note: { en: "30 days free. No credit card required.", es: "30 días gratis. No se requiere tarjeta de crédito." },

  // Meet Luxore
  meet_eyebrow: { en: "Meet Luxore", es: "Conoce Luxore" },
  meet_title: { en: "Meet Luxore.", es: "Conoce Luxore." },
  meet_subhead: {
    en: "Your entire beauty business. One beautifully connected platform.",
    es: "Todo tu negocio de belleza. Una plataforma conectada y elegante.",
  },

  // Everything, connected
  features_eyebrow: { en: "Everything, connected", es: "Todo, conectado" },
  features_title: { en: "Everything your beauty business needs.", es: "Todo lo que necesita tu negocio de belleza." },
  features_subhead: { en: "One beautifully connected platform.", es: "Una plataforma bella y conectada." },

  cat_scheduling_payments: { en: "Scheduling & Payments", es: "Agenda y pagos" },
  cat_clients_relationships: { en: "Clients & Relationships", es: "Clientes y relaciones" },
  cat_marketing_communication: { en: "Marketing & Communication", es: "Marketing y comunicación" },
  cat_business_management: { en: "Business Management", es: "Gestión del negocio" },

  cat_item_calendar_scheduling: { en: "Calendar & Scheduling", es: "Calendario y agenda" },
  cat_item_online_booking: { en: "Online Booking", es: "Reservas en línea" },
  cat_item_checkout_pos: { en: "Checkout / POS", es: "Cobro / Caja" },
  cat_item_deposits: { en: "Deposits", es: "Depósitos" },
  cat_item_payments: { en: "Payments", es: "Pagos" },
  cat_item_gift_cards: { en: "Gift Cards", es: "Tarjetas de regalo" },
  cat_item_waitlist: { en: "Waitlist", es: "Lista de espera" },

  cat_item_client_management: { en: "Client Management", es: "Gestión de clientes" },
  cat_item_client_profiles: { en: "Client Profiles", es: "Perfiles de clientes" },
  cat_item_forms: { en: "Forms", es: "Formularios" },
  cat_item_appointment_history: { en: "Appointment History", es: "Historial de citas" },
  cat_item_before_after: { en: "Before & After Photos", es: "Fotos de antes y después" },
  cat_item_memberships_packages: { en: "Memberships & Packages", es: "Membresías y paquetes" },
  cat_item_loyalty: { en: "Loyalty", es: "Fidelidad" },
  cat_item_reviews: { en: "Reviews", es: "Reseñas" },

  cat_item_messages: { en: "Messages", es: "Mensajes" },
  cat_item_appointment_reminders: { en: "Appointment Reminders", es: "Recordatorios de citas" },
  cat_item_automated_flows: { en: "Automated Flows", es: "Flujos automatizados" },
  cat_item_campaigns: { en: "Campaigns", es: "Campañas" },
  cat_item_promotions: { en: "Promotions", es: "Promociones" },
  cat_item_rebooking: { en: "Rebooking", es: "Reprogramación" },
  cat_item_birthday_messages: { en: "Birthday Messages", es: "Mensajes de cumpleaños" },
  cat_item_client_segmentation: { en: "Client Segmentation", es: "Segmentación de clientes" },

  cat_item_staff_management: { en: "Staff Management", es: "Gestión de personal" },
  cat_item_services: { en: "Services", es: "Servicios" },
  cat_item_inventory_retail: { en: "Inventory & Retail", es: "Inventario y venta al público" },
  cat_item_reports: { en: "Reports", es: "Reportes" },
  cat_item_multiple_locations: { en: "Multiple Locations", es: "Múltiples ubicaciones" },
  cat_item_business_hours: { en: "Business Hours", es: "Horario del negocio" },
  cat_item_website_branding: { en: "Website & Branding", es: "Sitio web y marca" },
  feature_bookings_title: { en: "Bookings & Calendar", es: "Reservas y calendario" },
  feature_bookings_body: {
    en: "An hourly calendar built around your real business hours, with 24/7 online booking.",
    es: "Un calendario por horas basado en tus horarios reales, con reservas en línea 24/7.",
  },
  feature_clients_title: { en: "Client Profiles", es: "Perfiles de clientes" },
  feature_clients_body: { en: "Every visit, note, form and preference in one place.", es: "Cada visita, nota, formulario y preferencia en un solo lugar." },
  feature_payments_title: { en: "Payments & POS", es: "Pagos y punto de venta" },
  feature_payments_body: {
    en: "Deposits, cards and manual payments — one real record of every transaction.",
    es: "Depósitos, tarjetas y pagos manuales — un registro real de cada transacción.",
  },
  feature_inventory_title: { en: "Inventory", es: "Inventario" },
  feature_inventory_body: {
    en: "Track products and retail stock alongside the services that use them.",
    es: "Controla productos y existencias junto a los servicios que los utilizan.",
  },
  feature_marketing_title: { en: "Marketing & Automations", es: "Marketing y automatizaciones" },
  feature_marketing_body: {
    en: "Reminders, review requests and loyalty — built in, not bolted on.",
    es: "Recordatorios, solicitudes de reseñas y fidelidad — integrados, no añadidos.",
  },
  feature_website_title: { en: "Your Own Website", es: "Tu propio sitio web" },
  feature_website_body: {
    en: "A branded booking page clients can find, browse and book from.",
    es: "Una página de reservas con tu marca que tus clientes pueden encontrar y usar.",
  },

  // Bookings & Calendar landing section
  bookings_eyebrow: { en: "Bookings & Calendar", es: "Reservas y calendario" },
  bookings_title: { en: "Bookings that work while you don't.", es: "Reservas que trabajan aunque tú no." },
  bookings_body: {
    en: "An hourly calendar built around each staff member's real schedule — availability, service duration, business hours and blocked time all respected automatically. Clients see real open times and book themselves, any hour of the day.",
    es: "Un calendario por horas basado en el horario real de cada miembro del personal — disponibilidad, duración del servicio, horario del negocio y tiempo bloqueado, todo respetado automáticamente. Los clientes ven horarios reales disponibles y reservan por sí mismos a cualquier hora.",
  },
  bookings_li1: { en: "24/7 online booking, no phone calls required", es: "Reservas en línea 24/7, sin llamadas telefónicas" },
  bookings_li2: { en: "Staff-specific availability and qualified services", es: "Disponibilidad por miembro del personal y servicios calificados" },
  bookings_li3: { en: "Business hours and blocked time built into every slot", es: "Horario del negocio y tiempo bloqueado integrados en cada horario" },
  bookings_li4: { en: "Full appointment management: edit, reschedule, cancel", es: "Gestión completa de citas: editar, reprogramar, cancelar" },

  // Clients & Forms
  clients_eyebrow: { en: "Clients & Forms", es: "Clientes y formularios" },
  clients_section_title: { en: "Know every client.", es: "Conoce a cada cliente." },
  clients_body: {
    en: "Visit history, notes, allergies and preferences travel with every client automatically. The New Client form collects what you need up front — and syncs straight into their profile, so nothing gets typed twice.",
    es: "El historial de visitas, notas, alergias y preferencias viaja con cada cliente automáticamente. El formulario de nuevo cliente recopila lo que necesitas desde el inicio — y se sincroniza directo con su perfil, sin escribir nada dos veces.",
  },

  // Payments + Hardware
  payments_eyebrow: { en: "Payments", es: "Pagos" },
  payments_title: { en: "Payments, your way.", es: "Pagos, a tu manera." },
  payments_body: {
    en: "From cards and cash today to Tap to Pay and a complete front-desk setup, Luxore brings appointments, checkout and payments together in one connected experience.",
    es: "Desde tarjetas y efectivo hoy, hasta Tap to Pay y una recepción completa, Luxore une citas, cobro y pagos en una sola experiencia conectada.",
  },
  hardware_tap_headline: { en: "Your phone can be your checkout.", es: "Tu teléfono puede ser tu punto de cobro." },
  hardware_tap_body: {
    en: "Accept eligible contactless payments from a compatible phone — no extra hardware needed for on-the-go checkout.",
    es: "Acepta pagos sin contacto elegibles desde un teléfono compatible — sin hardware adicional para cobrar sobre la marcha.",
  },
  hardware_card_headline: { en: "Simple payments, anywhere.", es: "Pagos simples, en cualquier lugar." },
  hardware_card_body: {
    en: "A compact, Luxore-compatible card reader for a fast, professional checkout experience.",
    es: "Un lector de tarjetas compacto y compatible con Luxore para un cobro rápido y profesional.",
  },
  hardware_terminal_headline: { en: "A better front desk.", es: "Una mejor recepción." },
  hardware_terminal_body: {
    en: "A complete countertop terminal connected directly to Luxore checkout.",
    es: "Una terminal completa de mostrador conectada directamente al cobro de Luxore.",
  },
  hardware_cta: { en: "Learn More", es: "Saber más" },
  hardware_note: {
    en: "Hardware options are still being finalized — exact models, pricing and availability will be announced closer to launch.",
    es: "Las opciones de hardware aún se están definiendo — modelos, precios y disponibilidad exactos se anunciarán más cerca del lanzamiento.",
  },

  // Inventory landing section
  inventory_eyebrow: { en: "Inventory", es: "Inventario" },
  inventory_title: { en: "Know what's selling — and what's running out.", es: "Sabe qué se vende — y qué se está agotando." },
  inventory_body: {
    en: "Track retail products and the services that use them side by side, with low-stock alerts before you run out mid-appointment.",
    es: "Controla productos de venta al público y los servicios que los usan, con alertas de bajo inventario antes de quedarte sin stock a mitad de una cita.",
  },

  // Marketing & Growth
  marketing_eyebrow: { en: "Marketing & Growth", es: "Marketing y crecimiento" },
  marketing_title: { en: "Turn empty appointments into revenue.", es: "Convierte horarios vacíos en ingresos." },
  marketing_body: {
    en: "Confirmations, deposit reminders and review requests trigger automatically around every appointment, alongside built-in loyalty points and promo codes. Connect an SMS or email provider and they go out on their own.",
    es: "Confirmaciones, recordatorios de depósito y solicitudes de reseñas se activan automáticamente en cada cita, junto con puntos de fidelidad y códigos promocionales integrados. Conecta un proveedor de SMS o correo y se envían solos.",
  },

  // Personalized Websites
  websites_eyebrow: { en: "Your Own Website", es: "Tu propio sitio web" },
  websites_title: { en: "Your business deserves more than a booking link.", es: "Tu negocio merece más que un simple enlace de reservas." },
  websites_body: {
    en: "Every Luxore business gets its own branded page — logo, colors and photos included.",
    es: "Cada negocio en Luxore obtiene su propia página con su marca — logo, colores y fotos incluidos.",
  },

  // How It Works
  how_it_works_eyebrow: { en: "How it works", es: "Cómo funciona" },
  how_it_works_title: { en: "Up and running in one sitting.", es: "Listo y funcionando en una sola sesión." },
  step1_title: { en: "Set up your business", es: "Configura tu negocio" },
  step1_body: { en: "Add your services, staff, hours and locations in minutes.", es: "Agrega tus servicios, personal, horarios y ubicaciones en minutos." },
  step2_title: { en: "Get booked online", es: "Recibe reservas en línea" },
  step2_body: { en: "Share your Luxore page so clients can book themselves, any time.", es: "Comparte tu página de Luxore para que tus clientes reserven solos, a cualquier hora." },
  step3_title: { en: "Run and grow your business with Luxore", es: "Administra y haz crecer tu negocio con Luxore" },
  step3_body: {
    en: "Automated reminders, reviews and reports help you run — and grow — the business.",
    es: "Recordatorios automáticos, reseñas y reportes te ayudan a administrar — y hacer crecer — el negocio.",
  },

  // About
  about_eyebrow: { en: "About Luxore", es: "Acerca de Luxore" },
  about_title: {
    en: "Beauty businesses shouldn't need five different tools to run one business.",
    es: "Los negocios de belleza no deberían necesitar cinco herramientas distintas para administrar un solo negocio.",
  },
  about_body: {
    en: "A booking app for the calendar, a spreadsheet for clients, a separate tool for payments, a website that never quite matches — Luxore replaces all of it with one connected platform, built around the real day-to-day of a salon, spa or studio.",
    es: "Una app de reservas para el calendario, una hoja de cálculo para clientes, otra herramienta para pagos, un sitio web que nunca combina — Luxore reemplaza todo eso con una sola plataforma conectada, construida para el día a día real de un salón, spa o estudio.",
  },

  // Success Stories / Reviews
  reviews_eyebrow: { en: "Success Stories", es: "Casos de éxito" },
  reviews_title: { en: "From real Luxore businesses.", es: "De negocios reales en Luxore." },
  reviews_coming_soon: { en: "Coming soon", es: "Próximamente" },
  reviews_placeholder_note: {
    en: "Real reviews from Luxore businesses will appear here once they're in.",
    es: "Reseñas reales de negocios en Luxore aparecerán aquí una vez que las tengamos.",
  },

  // FAQ
  faq_eyebrow: { en: "FAQ", es: "Preguntas frecuentes" },
  faq_title: { en: "Questions, answered.", es: "Preguntas, respondidas." },
  faq_q1: { en: "What types of beauty businesses can use Luxore?", es: "¿Qué tipos de negocios de belleza pueden usar Luxore?" },
  faq_a1: {
    en: "Hair salons, nail salons, lash and brow studios, makeup and beauty studios, beauty suites and full-service salons all run on Luxore.",
    es: "Salones de cabello, salones de uñas, estudios de pestañas y cejas, estudios de maquillaje y belleza, suites de belleza y salones de servicio completo — todos funcionan con Luxore.",
  },
  faq_q2: { en: "Can my clients book online?", es: "¿Mis clientes pueden reservar en línea?" },
  faq_a2: {
    en: "Yes. Clients see real availability based on your staff, services and business hours, and can book 24/7 from your own Luxore website.",
    es: "Sí. Los clientes ven disponibilidad real según tu personal, servicios y horario, y pueden reservar 24/7 desde tu propio sitio web de Luxore.",
  },
  faq_q3: { en: "Can I manage multiple staff members?", es: "¿Puedo administrar varios miembros del personal?" },
  faq_a3: {
    en: "Yes. Each staff member has their own schedule, services and permissions — Luxore works for a solo chair or a growing team.",
    es: "Sí. Cada miembro del personal tiene su propio horario, servicios y permisos — Luxore funciona para una silla individual o un equipo en crecimiento.",
  },
  faq_q4: { en: "Does Luxore support multiple locations?", es: "¿Luxore admite múltiples ubicaciones?" },
  faq_a4: {
    en: "Yes. Each location can have its own hours, staff and services under the same business account.",
    es: "Sí. Cada ubicación puede tener su propio horario, personal y servicios bajo la misma cuenta de negocio.",
  },
  faq_q5: { en: "Can I import my existing clients?", es: "¿Puedo importar mis clientes existentes?" },
  faq_a5: {
    en: "Yes — import from a CSV file, your phone contacts, or add clients manually, with duplicates detected automatically.",
    es: "Sí — impórtalos desde un archivo CSV, tus contactos telefónicos, o agrégalos manualmente, con detección automática de duplicados.",
  },
  faq_q6: { en: "Can I use Luxore in English and Spanish?", es: "¿Puedo usar Luxore en inglés y en español?" },
  faq_a6: {
    en: "Yes. Your dashboard and your public booking page can each be set to English, Spanish, or both — clients can switch languages themselves.",
    es: "Sí. Tu panel y tu página pública de reservas pueden configurarse en inglés, español, o ambos — los clientes pueden cambiar de idioma ellos mismos.",
  },
  faq_q7: { en: "Can I accept payments?", es: "¿Puedo aceptar pagos?" },
  faq_a7: {
    en: "Yes — cards, cash and other manual methods are supported today at checkout, with more payment options on the way.",
    es: "Sí — hoy se admiten tarjetas, efectivo y otros métodos manuales en el cobro, con más opciones de pago en camino.",
  },
  faq_q8: { en: "Does Luxore include a website for my business?", es: "¿Luxore incluye un sitio web para mi negocio?" },
  faq_a8: {
    en: "Yes. Every Luxore business gets its own branded booking page — logo, colors and photos included.",
    es: "Sí. Cada negocio en Luxore obtiene su propia página de reservas con su marca — logo, colores y fotos incluidos.",
  },
  faq_q9: { en: "What happens after my free month?", es: "¿Qué pasa después de mi mes gratis?" },
  faq_a9: {
    en: "You'll choose the Luxore plan that fits your business to keep going. Your data stays safe and waiting either way.",
    es: "Elegirás el plan de Luxore que se ajuste a tu negocio para continuar. Tu información permanece segura de cualquier forma.",
  },

  // Made for every beauty business
  made_for_beauty_eyebrow: { en: "Made for every beauty business", es: "Hecho para cada negocio de belleza" },
  made_for_beauty_title: { en: "Made for beauty. Built for business.", es: "Hecho para la belleza. Construido para el negocio." },
  cat_hair_salons: { en: "Hair Salons", es: "Salones de cabello" },
  cat_nail_salons: { en: "Nail Salons", es: "Salones de uñas" },
  cat_lash_brow_studios: { en: "Lash & Brow Studios", es: "Estudios de pestañas y cejas" },
  cat_makeup_studios: { en: "Makeup & Beauty Studios", es: "Estudios de maquillaje y belleza" },
  made_for_beauty_note: {
    en: "Beauty suites and full-service salons run on Luxore too.",
    es: "Los suites de belleza y los salones de servicio completo también funcionan con Luxore.",
  },

  // Team
  team_eyebrow: { en: "Team", es: "Equipo" },
  team_title: { en: "Run it together.", es: "Adminístralo en equipo." },
  team_body: {
    en: "Add every stylist, technician and front-desk teammate, each with their own schedule, services and permissions. Luxore grows from a solo chair to a full team without switching tools.",
    es: "Agrega a cada estilista, técnico y compañero de recepción, cada uno con su propio horario, servicios y permisos. Luxore crece desde una silla individual hasta un equipo completo sin cambiar de herramienta.",
  },

  // 30-Day Free Trial banner
  trial_banner_eyebrow: { en: "30-Day Free Trial", es: "30 días de prueba gratis" },
  trial_banner_title: { en: "Try the whole platform. On us.", es: "Prueba toda la plataforma. Por nuestra cuenta." },
  trial_banner_body: {
    en: "Set up your business, add your team and start taking bookings — free for 30 days, no credit card required.",
    es: "Configura tu negocio, agrega a tu equipo y empieza a recibir reservas — gratis durante 30 días, sin tarjeta de crédito.",
  },

  // Final CTA
  final_cta_title: { en: "Your business deserves more than a booking app.", es: "Tu negocio merece más que una simple app de reservas." },
  final_cta_subtitle: { en: "Run it with Luxore.", es: "Adminístralo con Luxore." },

  // Footer
  footer_tagline: { en: "The all-in-one operating platform for beauty businesses.", es: "La plataforma operativa todo en uno para negocios de belleza." },
  footer_product: { en: "Product", es: "Producto" },
  footer_company: { en: "Company", es: "Empresa" },
  footer_legal: { en: "Legal", es: "Legal" },
  footer_language: { en: "Language", es: "Idioma" },
  footer_online_booking: { en: "Online Booking", es: "Reservas en línea" },
  footer_hardware: { en: "Hardware", es: "Hardware" },
  footer_contact: { en: "Contact", es: "Contacto" },
  footer_support: { en: "Support", es: "Soporte" },
  footer_help_center: { en: "Help Center", es: "Centro de ayuda" },
  footer_contact_support: { en: "Contact Support", es: "Contactar soporte" },
  footer_privacy: { en: "Privacy Policy", es: "Política de privacidad" },
  footer_terms: { en: "Terms of Service", es: "Términos de servicio" },
  footer_cookies: { en: "Cookie Preferences", es: "Preferencias de cookies" },
  footer_rights: { en: "All rights reserved.", es: "Todos los derechos reservados." },

  // Auth: Login
  welcome_back: { en: "Welcome back", es: "Bienvenido de nuevo" },
  login_subtitle: { en: "Log in to manage your business.", es: "Inicia sesión para administrar tu negocio." },
  field_email: { en: "Email", es: "Correo electrónico" },
  field_password: { en: "Password", es: "Contraseña" },
  log_in_button: { en: "Log In", es: "Iniciar sesión" },
  logging_in: { en: "Logging in…", es: "Iniciando sesión…" },
  new_to_luxore: { en: "New to Luxore?", es: "¿Nuevo en Luxore?" },

  // Auth: Register
  register_title: { en: "Start your free month", es: "Comienza tu mes gratis" },
  step1_label: { en: "1. Business Information", es: "1. Información del negocio" },
  step2_label: { en: "2. Account", es: "2. Cuenta" },
  dashboard_language_label: { en: "Dashboard Language", es: "Idioma del panel" },
  dashboard_language_note: {
    en: "Your dashboard will use this language. You can change it later in Settings.",
    es: "Tu panel usará este idioma. Puedes cambiarlo después en Configuración.",
  },
  field_business_name: { en: "Business Name", es: "Nombre del negocio" },
  field_owner_full_name: { en: "Owner Full Name", es: "Nombre completo del propietario" },
  field_business_phone: { en: "Business Phone", es: "Teléfono del negocio" },
  field_business_email: { en: "Business Email", es: "Correo del negocio" },
  field_address: { en: "Address", es: "Dirección" },
  field_city: { en: "City", es: "Ciudad" },
  field_state: { en: "State", es: "Estado" },
  field_zip: { en: "ZIP", es: "Código postal" },
  field_business_type: { en: "Business Type", es: "Tipo de negocio" },
  select_business_type: { en: "Select business type", es: "Selecciona el tipo de negocio" },
  field_business_type_other: { en: "Please describe your business type", es: "Describe tu tipo de negocio" },
  field_description_optional: { en: "Description (optional)", es: "Descripción (opcional)" },
  continue_button: { en: "Continue", es: "Continuar" },
  step1_errors_note: {
    en: "Please check the business information from step 1 — some fields need attention.",
    es: "Revisa la información del negocio del paso 1 — algunos campos necesitan atención.",
  },
  field_confirm_password: { en: "Confirm Password", es: "Confirmar contraseña" },
  creating_account: { en: "Creating your account…", es: "Creando tu cuenta…" },
  create_account_button: { en: "Create Account", es: "Crear cuenta" },
  already_have_account: { en: "Already have an account?", es: "¿Ya tienes una cuenta?" },
  log_in_link: { en: "Log in", es: "Iniciar sesión" },

  // Public business page (/b/[slug])
  book_with: { en: "Book with", es: "Reserva con" },
  book_now: { en: "Book Now", es: "Reservar ahora" },
  public_services_title: { en: "Services", es: "Servicios" },
  no_services_published: { en: "No services published yet.", es: "Aún no hay servicios publicados." },
  our_team: { en: "Our Team", es: "Nuestro equipo" },
  hours_title: { en: "Hours", es: "Horario" },
  closed_label: { en: "Closed", es: "Cerrado" },
  public_reviews_title: { en: "Reviews", es: "Reseñas" },
  response_label: { en: "Response:", es: "Respuesta:" },
  powered_by_luxore: { en: "Powered by Luxore", es: "Desarrollado por Luxore" },
  day_sunday: { en: "Sunday", es: "Domingo" },
  day_monday: { en: "Monday", es: "Lunes" },
  day_tuesday: { en: "Tuesday", es: "Martes" },
  day_wednesday: { en: "Wednesday", es: "Miércoles" },
  day_thursday: { en: "Thursday", es: "Jueves" },
  day_friday: { en: "Friday", es: "Viernes" },
  day_saturday: { en: "Saturday", es: "Sábado" },

  // Booking wizard
  book_an_appointment: { en: "Book an Appointment", es: "Reservar una cita" },
  online_booking_unavailable: {
    en: "Online booking isn't available right now — please contact",
    es: "Las reservas en línea no están disponibles ahora mismo — por favor contacta a",
  },
  online_booking_unavailable_suffix: { en: "directly to schedule.", es: "directamente para agendar." },
  wiz_step1_title: { en: "1. Select Service", es: "1. Selecciona el servicio" },
  wiz_step2_title: { en: "2. Select Professional", es: "2. Selecciona el profesional" },
  any_available: { en: "Any Available", es: "Cualquiera disponible" },
  wiz_step3_title: { en: "3. Select Date & Time", es: "3. Selecciona fecha y hora" },
  loading_times: { en: "Loading available times…", es: "Cargando horarios disponibles…" },
  no_availability_note: {
    en: "No availability on this date. Try another day, or:",
    es: "No hay disponibilidad en esta fecha. Prueba otro día, o:",
  },
  wiz_step4_title: { en: "4. Your Information", es: "4. Tu información" },
  placeholder_full_name: { en: "Full Name", es: "Nombre completo" },
  placeholder_phone: { en: "Phone", es: "Teléfono" },
  placeholder_email: { en: "Email", es: "Correo electrónico" },
  checking_ellipsis: { en: "Checking…", es: "Verificando…" },
  welcome_back_comma: { en: "Welcome back,", es: "Bienvenido de nuevo," },
  found_existing_profile: {
    en: "We found an existing profile. Is this you?",
    es: "Encontramos un perfil existente. ¿Eres tú?",
  },
  yes_label: { en: "Yes", es: "Sí" },
  no_label: { en: "No", es: "No" },
  wiz_step5_title: { en: "5. Confirm Appointment", es: "5. Confirma tu cita" },
  word_at: { en: "at", es: "a las" },
  deposit_note: {
    en: "This service requires a deposit. Online deposit collection isn't enabled yet — the business will follow up with you directly about it.",
    es: "Este servicio requiere un depósito. El cobro de depósitos en línea aún no está habilitado — el negocio se pondrá en contacto contigo directamente al respecto.",
  },
  i_agree: { en: "I agree", es: "Acepto" },
  placeholder_signature: { en: "Type your full name to sign", es: "Escribe tu nombre completo para firmar" },
  placeholder_notes_optional: { en: "Notes for the business (optional)", es: "Notas para el negocio (opcional)" },
  booking_ellipsis: { en: "Booking…", es: "Reservando…" },
  confirm_appointment_button: { en: "Confirm Appointment", es: "Confirmar cita" },
  could_not_complete_booking: { en: "Could not complete booking.", es: "No se pudo completar la reserva." },
  something_went_wrong: { en: "Something went wrong. Please try again.", es: "Algo salió mal. Inténtalo de nuevo." },

  // Waitlist
  waitlist_joined_note: {
    en: "You're on the waitlist — we'll reach out if a spot opens up.",
    es: "Estás en la lista de espera — te contactaremos si se abre un espacio.",
  },
  could_not_join_waitlist: { en: "Could not join the waitlist. Please try again.", es: "No se pudo unir a la lista de espera. Inténtalo de nuevo." },
  joining_ellipsis: { en: "Joining…", es: "Uniéndose…" },
  join_waitlist_button: { en: "Join Waitlist", es: "Unirse a la lista de espera" },

  // Booking confirmed
  appointment_requested: { en: "Appointment Requested", es: "Cita solicitada" },
  youre_booked: { en: "You're booked!", es: "¡Tu cita está reservada!" },
  confirmed_pending_note: {
    en: "The business will confirm your appointment shortly. Text and email confirmations arrive once messaging is enabled — for now, save this page or contact the business directly with any questions.",
    es: "El negocio confirmará tu cita en breve. Las confirmaciones por texto y correo llegarán una vez que se habilite la mensajería — por ahora, guarda esta página o contacta directamente al negocio si tienes preguntas.",
  },
  back_to_business_page: { en: "Back to Business Page", es: "Volver a la página del negocio" },
} as const;

export type TranslationKey = keyof typeof dictionary;

export function t(locale: Locale, key: TranslationKey): string {
  return dictionary[key][locale] ?? dictionary[key].en;
}

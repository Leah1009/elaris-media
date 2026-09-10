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
} as const;

export type TranslationKey = keyof typeof dictionary;

export function t(locale: Locale, key: TranslationKey): string {
  return dictionary[key][locale] ?? dictionary[key].en;
}

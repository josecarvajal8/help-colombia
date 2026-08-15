export type Language = "es" | "en";

export const LANGUAGES: Language[] = ["es", "en"];

export type Dictionary = {
  header: {
    subtitle: string;
    navPublic: string;
    navAdmin: string;
  };
  status: { abierto: string; saturado: string; cerrado: string };
  statusOptions: { abierto: string; saturado: string; cerrado: string };
  priority: { alta: string; media: string; baja: string };
  city: { all: string; NJ: string; NYC: string };
  point: {
    needsTitle: string;
    needsEmpty: string;
    moreCount: (n: number) => string;
    viewDetails: string;
    donationTitle: string;
    openMaps: string;
    close: string;
  };
  relativeTime: {
    justNow: string;
    minutesAgo: (n: number) => string;
    hoursAgo: (n: number) => string;
    daysAgo: (n: number) => string;
  };
  publicView: {
    heading: string;
    liveUpdated: string;
    introBefore: string;
    introAfter: string;
    emptyFiltered: string;
  };
  login: {
    heading: string;
    description: string;
    emailPlaceholder: string;
    submit: string;
    sending: string;
    sentMessage: string;
    errorMessage: string;
  };
  unauthorized: {
    heading: string;
    message: (email: string) => string;
  };
  signOut: string;
  coordinator: {
    loading: string;
    notFound: (email: string) => string;
    sessionLine: (email: string, city: string) => string;
    saving: string;
    saved: string;
    saveError: string;
    statusLabel: string;
    addressLabel: string;
    mapsLabel: string;
    donationLabel: string;
    donationPlaceholder: string;
    needsLabel: string;
    addNeed: string;
    newNeedDefault: string;
  };
  admin: {
    heading: string;
    sessionLine: (email: string) => string;
    loadingPoints: string;
    newPointTitle: string;
    namePlaceholder: string;
    addressPlaceholder: string;
    mapsPlaceholder: string;
    createButton: string;
    creatingButton: string;
    coordinatorLabel: (email: string) => string;
    noCoordinator: string;
    invitePlaceholder: string;
    inviteButton: string;
    inviteError: string;
    deletePoint: string;
    needsToggle: (n: number) => string;
  };
};

const es: Dictionary = {
  header: {
    subtitle: "Coordinación de ayuda para Colombia",
    navPublic: "Vista pública",
    navAdmin: "Panel admin",
  },
  status: {
    abierto: "Recibiendo",
    saturado: "Saturado",
    cerrado: "Cerrado",
  },
  statusOptions: {
    abierto: "Recibiendo donaciones",
    saturado: "Saturado (parcial)",
    cerrado: "Cerrado",
  },
  priority: {
    alta: "Urgente",
    media: "Necesario",
    baja: "Ya hay suficiente pronto",
  },
  city: {
    all: "Todas las ciudades",
    NJ: "Nueva Jersey",
    NYC: "Nueva York",
  },
  point: {
    needsTitle: "Se necesita",
    needsEmpty: "✓ No se requiere nada más por ahora",
    moreCount: (n) => `+${n} más`,
    viewDetails: "Ver detalles →",
    donationTitle: "Donación en dinero",
    openMaps: "Abrir en Google Maps →",
    close: "Cerrar",
  },
  relativeTime: {
    justNow: "justo ahora",
    minutesAgo: (n) => `hace ${n} min`,
    hoursAgo: (n) => `hace ${n} h`,
    daysAgo: (n) => `hace ${n} d`,
  },
  publicView: {
    heading: "Puntos de acopio activos",
    liveUpdated: "actualizado en vivo",
    introBefore:
      "Antes de llevar donaciones, revisa qué necesita cada punto y su nivel de disponibilidad. Los puntos marcados como",
    introAfter:
      "no requieren más de ese artículo por ahora — considera otro punto o espera nueva actualización.",
    emptyFiltered: "No hay puntos de acopio para este filtro todavía.",
  },
  login: {
    heading: "Acceso de coordinadores",
    description:
      "Escribe el correo con el que fuiste invitado — te enviaremos un enlace de acceso, sin contraseña.",
    emailPlaceholder: "tu@correo.com",
    submit: "Enviar enlace de acceso",
    sending: "Enviando...",
    sentMessage: "Listo — revisa tu correo y haz clic en el enlace para entrar.",
    errorMessage: "No pudimos enviar el enlace. Intenta de nuevo.",
  },
  unauthorized: {
    heading: "Sin acceso todavía",
    message: (email) =>
      `Tu cuenta (${email}) inició sesión correctamente, pero no está asignada a ningún punto ni tiene rol de administrador. Contacta al administrador para que te asigne un punto.`,
  },
  signOut: "Cerrar sesión",
  coordinator: {
    loading: "Cargando tu punto…",
    notFound: (email) => `No encontramos un punto asignado a tu cuenta (${email}).`,
    sessionLine: (email, city) => `Sesión de ${email} · ${city}`,
    saving: "Guardando…",
    saved: "✓ Guardado",
    saveError: "No se pudo guardar — intenta de nuevo",
    statusLabel: "Estado del punto",
    addressLabel: "Dirección",
    mapsLabel: "Enlace de Google Maps",
    donationLabel: "Datos para donación en dinero (opcional)",
    donationPlaceholder: "Ej: Nequi 300 123 4567 — A nombre de...",
    needsLabel: "Qué se necesita",
    addNeed: "+ Agregar artículo",
    newNeedDefault: "Nuevo artículo",
  },
  admin: {
    heading: "Panel admin",
    sessionLine: (email) => `Sesión de ${email}`,
    loadingPoints: "Cargando puntos…",
    newPointTitle: "Registrar nuevo punto de acopio",
    namePlaceholder: "Nombre del punto",
    addressPlaceholder: "Dirección",
    mapsPlaceholder: "Enlace de Google Maps (opcional)",
    createButton: "+ Crear punto",
    creatingButton: "Creando...",
    coordinatorLabel: (email) => `Coordinador: ${email}`,
    noCoordinator: "Sin coordinador asignado",
    invitePlaceholder: "correo del coordinador",
    inviteButton: "Invitar",
    inviteError: "Error al invitar",
    deletePoint: "Eliminar punto",
    needsToggle: (n) => `Necesidades (${n})`,
  },
};

const en: Dictionary = {
  header: {
    subtitle: "Coordinating relief for Colombia",
    navPublic: "Public view",
    navAdmin: "Admin panel",
  },
  status: {
    abierto: "Open",
    saturado: "Saturated",
    cerrado: "Closed",
  },
  statusOptions: {
    abierto: "Receiving donations",
    saturado: "Saturated (partial)",
    cerrado: "Closed",
  },
  priority: {
    alta: "Urgent",
    media: "Needed",
    baja: "Enough for now",
  },
  city: {
    all: "All cities",
    NJ: "New Jersey",
    NYC: "New York",
  },
  point: {
    needsTitle: "Needed",
    needsEmpty: "✓ Nothing else needed right now",
    moreCount: (n) => `+${n} more`,
    viewDetails: "View details →",
    donationTitle: "Money donations",
    openMaps: "Open in Google Maps →",
    close: "Close",
  },
  relativeTime: {
    justNow: "just now",
    minutesAgo: (n) => `${n} min ago`,
    hoursAgo: (n) => `${n}h ago`,
    daysAgo: (n) => `${n}d ago`,
  },
  publicView: {
    heading: "Active donation points",
    liveUpdated: "live updates",
    introBefore:
      "Before bringing donations, check what each point needs and how available it is. Points marked",
    introAfter:
      "don't need more of that item right now — consider another point or wait for an update.",
    emptyFiltered: "No donation points for this filter yet.",
  },
  login: {
    heading: "Coordinator access",
    description:
      "Enter the email you were invited with — we'll send you a sign-in link, no password needed.",
    emailPlaceholder: "you@email.com",
    submit: "Send access link",
    sending: "Sending...",
    sentMessage: "Done — check your email and click the link to sign in.",
    errorMessage: "We couldn't send the link. Please try again.",
  },
  unauthorized: {
    heading: "No access yet",
    message: (email) =>
      `Your account (${email}) signed in successfully, but isn't assigned to a point or an admin role. Contact the admin to get assigned to a point.`,
  },
  signOut: "Sign out",
  coordinator: {
    loading: "Loading your point…",
    notFound: (email) => `We couldn't find a point assigned to your account (${email}).`,
    sessionLine: (email, city) => `Signed in as ${email} · ${city}`,
    saving: "Saving…",
    saved: "✓ Saved",
    saveError: "Couldn't save — try again",
    statusLabel: "Point status",
    addressLabel: "Address",
    mapsLabel: "Google Maps link",
    donationLabel: "Money donation details (optional)",
    donationPlaceholder: "E.g.: Zelle 555-123-4567 — Under the name...",
    needsLabel: "What's needed",
    addNeed: "+ Add item",
    newNeedDefault: "New item",
  },
  admin: {
    heading: "Admin panel",
    sessionLine: (email) => `Signed in as ${email}`,
    loadingPoints: "Loading points…",
    newPointTitle: "Register new donation point",
    namePlaceholder: "Point name",
    addressPlaceholder: "Address",
    mapsPlaceholder: "Google Maps link (optional)",
    createButton: "+ Create point",
    creatingButton: "Creating...",
    coordinatorLabel: (email) => `Coordinator: ${email}`,
    noCoordinator: "No coordinator assigned",
    invitePlaceholder: "coordinator's email",
    inviteButton: "Invite",
    inviteError: "Error sending invite",
    deletePoint: "Delete point",
    needsToggle: (n) => `Needs (${n})`,
  },
};

export const dictionaries: Record<Language, Dictionary> = { es, en };

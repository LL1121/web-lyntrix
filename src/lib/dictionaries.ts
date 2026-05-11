import { AppLocale } from "@/lib/i18n";

export const dictionaries = {
  en: {
    navbar: {
      links: { home: "Home", work: "Work", contact: "Contact" },
      cta: "Start a project",
    },
    hero: {
      badge: "AI-Powered Solutions",
      headlineTop: "We build the",
      headlineBottom: "future.",
      logoLetterIndex: 6,
      description:
        "Technology studio crafting next-gen experiences, AI integrations & scalable cloud architecture.",
      ctaPrimary: "Let's talk",
      ctaSecondary: "View our work",
      scroll: "Scroll",
    },
    manifesto: {
      kicker: "The Vision",
      titleTop: "Our",
      titleBottom: "philosophy.",
      sideCopy: "Not just a vendor. A long-term technical partner invested in your growth.",
      lines: [
        { text: "We don't just write code.", bold: true },
        { text: "We architect digital ecosystems that redefine what's possible.", bold: false },
        {
          text: "Lyntrix exists at the intersection of design precision, engineering excellence, and artificial intelligence.",
          bold: false,
        },
        {
          text: "Every pixel is intentional. Every interaction is crafted. Every solution is built to scale.",
          bold: false,
        },
        { text: "We partner with visionaries who refuse to settle for ordinary.", bold: true },
      ],
    },
    services: {
      kicker: "The Stack",
      titlePrefix: "What we",
      titleHighlight: "deliver",
      capabilities: "6 core capabilities",
      aiTitle: "Artificial Intelligence",
      aiDescription:
        "Custom LLMs, computer vision, RAG pipelines and intelligent automation that transform raw data into compounding business advantage. From model training to production deployment.",
    },
    vault: {
      kicker: "The Vault",
      titlePrefix: "Selected",
      titleHighlight: "work",
      activeHint: "Scrolling horizontally",
      idleHint: "Scroll to explore →",
      navHint: "← Scroll to navigate projects →",
      modalPrimary: "Start similar project",
      modalSecondary: "Request case study",
      liveSite: "Live site",
      repository: "Repository",
    },
    pageCtaWork: {
      kicker: "The Work",
      titlePrefix: "Engineering that",
      titleHighlight: "ships.",
      description: "Explore the full portfolio — products built for performance, designed for conversion.",
      cta: "Explore our work",
      stats: ["Projects Shipped", "Avg Conversion Lift", "Faster Deployment", "Client Satisfaction"],
    },
    pageCtaContact: {
      titleTop: "Stop waiting.",
      titleBottom: "Start shipping.",
      description:
        "Every day you wait is a day your competitors don't. Let's build something that dominates your market.",
      cta: "Start a project",
      badges: ["48h Response Time", "100% On-Time Delivery", "NDA Available", "Dedicated Project Lead"],
    },
    contact: {
      kicker: "Signal",
      titlePrefix: "Let's build",
      titleHighlight: "together",
      description: "Ready to elevate your digital presence? Drop us a signal.",
      placeholders: { name: "Your name", email: "your@email.com", message: "Tell us about your project..." },
      errors: { name: "Name is required", email: "Valid email required", message: "Message is required" },
      submit: "Send signal",
      apiError: "Message failed to send. Please try again.",
    },
    footer: {
      description:
        "We design and engineer high-fidelity digital products for teams that need speed, clarity, and measurable business impact.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      cookies: "Cookie Policy",
      crafted: "Crafted with precision.",
    },
    pages: {
      work: {
        kicker: "Our capabilities",
        titlePrefix: "Built to perform.",
        titleHighlight: "Engineered to scale.",
        description:
          "From AI pipelines to cloud architecture — every solution is built with one goal: compounding growth for your business.",
      },
      contact: {
        kicker: "Now taking projects",
        titlePrefix: "Let's build",
        titleHighlight: "the impossible.",
        description: "Tell us what you're building and we'll respond within 48 hours.",
      },
    },
  },
  es: {
    navbar: {
      links: { home: "Inicio", work: "Proyectos", contact: "Contacto" },
      cta: "Iniciar proyecto",
    },
    hero: {
      badge: "Soluciones impulsadas por IA",
      headlineTop: "Construimos eL",
      headlineBottom: "futuro.",
      logoLetterIndex: 13,
      description:
        "Estudio tecnológico que crea experiencias web de próxima generación, integraciones de IA y arquitectura cloud escalable.",
      ctaPrimary: "Hablemos",
      ctaSecondary: "Ver proyectos",
      scroll: "Scroll",
    },
    manifesto: {
      kicker: "La Visión",
      titleTop: "Nuestra",
      titleBottom: "filosofía.",
      sideCopy: "No somos solo un proveedor. Somos un socio técnico de largo plazo enfocado en tu crecimiento.",
      lines: [
        { text: "No solo escribimos código.", bold: true },
        { text: "Arquitectamos ecosistemas digitales que redefinen lo posible.", bold: false },
        {
          text: "Lyntrix existe en la intersección entre precisión de diseño, excelencia de ingeniería e inteligencia artificial.",
          bold: false,
        },
        {
          text: "Cada píxel es intencional. Cada interacción está cuidada. Cada solución está construida para escalar.",
          bold: false,
        },
        { text: "Trabajamos con visionarios que no se conforman con lo ordinario.", bold: true },
      ],
    },
    services: {
      kicker: "El Stack",
      titlePrefix: "Lo que",
      titleHighlight: "entregamos",
      capabilities: "6 capacidades clave",
      aiTitle: "Inteligencia Artificial",
      aiDescription:
        "LLMs personalizados, visión por computadora, pipelines RAG y automatización inteligente que convierten datos en ventaja competitiva. Desde entrenamiento de modelos hasta despliegue productivo.",
    },
    vault: {
      kicker: "El Vault",
      titlePrefix: "Proyectos",
      titleHighlight: "seleccionados",
      activeHint: "Desplazamiento horizontal",
      idleHint: "Desplazá para explorar →",
      navHint: "← Desplazá para navegar proyectos →",
      modalPrimary: "Iniciar proyecto similar",
      modalSecondary: "Solicitar caso de estudio",
      liveSite: "Sitio en vivo",
      repository: "Repositorio",
    },
    pageCtaWork: {
      kicker: "Proyectos",
      titlePrefix: "Ingeniería que",
      titleHighlight: "entrega.",
      description: "Explorá el portfolio completo: productos creados para performance y conversión.",
      cta: "Explorar proyectos",
      stats: ["Proyectos entregados", "Mejora prom. de conversión", "Despliegue más rápido", "Satisfacción de clientes"],
    },
    pageCtaContact: {
      titleTop: "No esperes más.",
      titleBottom: "Empezá a lanzar.",
      description:
        "Cada día que esperás es una ventaja para tu competencia. Construyamos algo que domine tu mercado.",
      cta: "Iniciar proyecto",
      badges: ["Respuesta en 48h", "100% entregas a tiempo", "NDA disponible", "Líder dedicado"],
    },
    contact: {
      kicker: "Señal",
      titlePrefix: "Construyamos",
      titleHighlight: "juntos",
      description: "¿Listo para elevar tu presencia digital? Envíanos una señal.",
      placeholders: { name: "Tu nombre", email: "tu@email.com", message: "Contanos sobre tu proyecto..." },
      errors: { name: "El nombre es obligatorio", email: "Ingresá un email válido", message: "El mensaje es obligatorio" },
      submit: "Enviar señal",
      apiError: "No se pudo enviar el mensaje. Intentá nuevamente.",
    },
    footer: {
      description:
        "Diseñamos y desarrollamos productos digitales de alta fidelidad para equipos que buscan velocidad, claridad e impacto medible.",
      privacy: "Política de Privacidad",
      terms: "Términos de Servicio",
      cookies: "Política de Cookies",
      crafted: "Hecho con precisión.",
    },
    pages: {
      work: {
        kicker: "Nuestras capacidades",
        titlePrefix: "Construido para rendir.",
        titleHighlight: "Diseñado para escalar.",
        description:
          "Desde pipelines de IA hasta arquitectura cloud: cada solución está pensada para multiplicar el crecimiento de tu negocio.",
      },
      contact: {
        kicker: "Tomando proyectos",
        titlePrefix: "Construyamos",
        titleHighlight: "lo imposible.",
        description: "Contanos qué estás construyendo y te respondemos dentro de 48 horas.",
      },
    },
  },
} as const;

export function getDictionary(locale: AppLocale) {
  return dictionaries[locale] ?? dictionaries.en;
}


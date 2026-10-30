/**
 * Seed de contenido institucional REAL de Fundación HOCES, extraído de la
 * encuesta "Levantamiento de Información Web — Fundación HOCES (Respuestas)".
 * No se inventan cifras de impacto, testimonios, noticias ni nombres de
 * profesionales que no fueron entregados por la fundación: esas secciones
 * quedan vacías con un estado vacío explicativo hasta que se complete la
 * información real desde el panel administrativo.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      orgName: "Fundación HOCES",
      legalName: "Fundación Hoces",
      rut: "65.255.723-6",
      legalRepresentative: "Solange Alessod (Directora)",
      slogan: "Cosechando Sueños",
      address: "Camino Melipilla 601",
      comuna: "Padre Hurtado",
      region: "Región Metropolitana",
      phone: "+56 9 6406 0198",
      whatsapp: "+56964060198",
      email: "",
      instagram: "fundacionhoces",
      facebook: "fundacionhoces",
      footerText:
        "Fundación HOCES es parte de la comunidad del Centro de Adoración Internacional.",
      donationBankInfo: "",
      donationSuggestedAmounts: "[10000,20000,50000,100000]",
      metaDescriptionDefault:
        "Fundación HOCES acompaña a niños, niñas, adolescentes y familias neurodivergentes en Padre Hurtado a través de terapias profesionales y acompañamiento integral.",
    },
    update: {},
  });

  await prisma.aboutContent.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      historia:
        "Fundación HOCES nació en 2025, impulsada por la pastora Solange Alessod. Todo comenzó después de un incendio que afectó el espacio para niños de la iglesia en el sector de Padre Hurtado. Al reconstruir ese lugar, surgió la idea de que cumpliera un propósito más amplio: no solo acoger actividades puntuales, sino transformarse en un espacio permanente de apoyo para familias con necesidades específicas, especialmente aquellas con niños, niñas y adolescentes neurodivergentes.",
      mision:
        "Nuestra misión es hacer realidad esta visión a través de un equipo de profesionales comprometidos, que no solo entreguen atención terapéutica, sino que también comprendan la importancia de acompañar, orientar y sostener a cada familia durante sus procesos.\n\nTrabajamos para entregar herramientas efectivas que favorezcan el desarrollo de cada persona y fortalezcan las capacidades de sus familias, promoviendo su participación e inclusión en los distintos espacios de la sociedad.\n\nAdemás, buscamos generar oportunidades de acceso a terapias para quienes más lo necesitan, impulsando becas y apoyos que permitan a niños, niñas, adolescentes y sus familias continuar sus procesos terapéuticos, incluso cuando los recursos económicos son una dificultad.",
      vision:
        "Nuestra visión es abrazar y acompañar a cada familia que enfrenta el desafío de tener un niño, niña o adolescente neurodivergente, contribuyendo a su desarrollo integral, cognitivo, emocional y social.\n\nAnhelamos que cada persona tenga oportunidades reales de desarrollar sus capacidades, alcanzar su máximo potencial y vivir una inclusión efectiva en la sociedad, siendo reconocida, valorada y respetada en su individualidad.\n\nSoñamos con una sociedad más consciente, empática e inclusiva, donde la neurodivergencia no sea una barrera para participar, aprender, crecer y desenvolverse plenamente.",
      proposito:
        "El propósito principal de Fundación HOCES es abrazar a las familias, acompañarlas y generar un impacto real en sus vidas. No se trata solamente de entregar terapias, sino de convertirnos en un espacio donde cada niño, niña, adolescente, adulto y su familia encuentren apoyo, contención, herramientas y esperanza.\n\nTenemos también el compromiso de generar oportunidades para aquellas familias que no cuentan con los recursos económicos para costear sus tratamientos, a través de becas y apoyos que nos permitan acercar la atención terapéutica a quienes más lo necesitan.",
      valores: JSON.stringify([
        { titulo: "Amor", descripcion: "" },
        { titulo: "Empatía", descripcion: "" },
        { titulo: "Colaboración", descripcion: "" },
        { titulo: "Esperanza", descripcion: "" },
        { titulo: "Respeto", descripcion: "" },
        { titulo: "Valoración", descripcion: "" },
        { titulo: "Compromiso", descripcion: "" },
      ]),
      hitos: JSON.stringify([
        { anio: "2025", texto: "Fundación de Fundación HOCES e inauguración de las primeras terapias." },
      ]),
      enfoqueCristiano:
        "Fundación HOCES es parte de la comunidad del Centro de Adoración Internacional y su enfoque cristiano es parte visible de su identidad. Para el equipo, la fe se relaciona con la expectativa, la esperanza y la convicción de que cada padre y madre puede encontrar fuerzas para acompañar a sus hijos en cada desafío.",
      versiculo: "",
    },
    update: {},
  });

  const homeBlocks: Array<{
    type: string;
    order: number;
    visible: boolean;
    title: string;
    subtitle: string;
    body: string;
    ctaLabel: string;
    ctaLink: string;
  }> = [
    {
      type: "HERO",
      order: 0,
      visible: true,
      title: "Cosechando Sueños",
      subtitle: "Acompañamos a niños, niñas, adolescentes y familias neurodivergentes en cada etapa de su desarrollo.",
      body: "",
      ctaLabel: "Quiero recibir información",
      ctaLink: "/contacto",
    },
    {
      type: "INTRO",
      order: 1,
      visible: true,
      title: "Un equipo comprometido con cada familia",
      subtitle: "",
      body: "Nuestras profesionales están capacitadas para trabajar con niños, niñas y adolescentes a través de terapias individuales y grupales, con experiencia en inclusión educacional. Queremos que cada familia se sienta acompañada y con la seguridad de que su hijo o hija está siendo cuidado, apoyado, respetado y valorado.",
      ctaLabel: "Conoce nuestra historia",
      ctaLink: "/quienes-somos",
    },
    {
      type: "MISSION_VISION",
      order: 2,
      visible: true,
      title: "Misión y visión",
      subtitle: "",
      body: "",
      ctaLabel: "Leer más",
      ctaLink: "/quienes-somos",
    },
    {
      type: "PROGRAMS",
      order: 3,
      visible: true,
      title: "Nuestros programas y servicios",
      subtitle: "Psicología Clínica, Terapia Ocupacional, Fonoaudiología, Educación Diferencial, Psicopedagogía, Acondicionamiento Físico y Asistencia Social.",
      body: "",
      ctaLabel: "Ver todos los servicios",
      ctaLink: "/servicios",
    },
    {
      type: "IMPACT",
      order: 4,
      visible: false,
      title: "Agrega aquí cifras de impacto verificadas",
      subtitle: "Por ejemplo: familias atendidas, años de trayectoria, becas otorgadas.",
      body: "Este bloque está oculto por defecto porque el prompt de desarrollo exige mostrar solo cifras verificadas. Actívalo desde el panel cuando la fundación confirme números reales.",
      ctaLabel: "",
      ctaLink: "",
    },
    {
      type: "DONATIONS",
      order: 5,
      visible: true,
      title: "Ayúdanos a seguir cosechando sueños",
      subtitle: "Tu aporte financia becas de terapia, medicamentos y consultas con especialistas externos para familias que no pueden costearlas.",
      body: "",
      ctaLabel: "Quiero colaborar",
      ctaLink: "/donaciones",
    },
    {
      type: "NEWS",
      order: 6,
      visible: true,
      title: "Noticias y actividades",
      subtitle: "",
      body: "",
      ctaLabel: "Ver todas las noticias",
      ctaLink: "/noticias",
    },
    {
      type: "MEMORIAS",
      order: 7,
      visible: true,
      title: "Transparencia institucional",
      subtitle: "Memorias anuales e informes de gestión de la fundación.",
      body: "",
      ctaLabel: "Ver documentos",
      ctaLink: "/transparencia",
    },
    {
      type: "COLLAB",
      order: 8,
      visible: true,
      title: "Súmate a esta misión",
      subtitle: "",
      body: "Ya sea como voluntario, colegio aliado o donante, hay un lugar para ti en Fundación HOCES.",
      ctaLabel: "Contáctanos",
      ctaLink: "/contacto",
    },
  ];

  for (const block of homeBlocks) {
    const existing = await prisma.homeBlock.findFirst({ where: { type: block.type } });
    if (!existing) {
      await prisma.homeBlock.create({ data: block });
    }
  }

  const programs = [
    {
      slug: "psicologia-clinica",
      name: "Psicología Clínica",
      shortDescription: "Atención infanto-juvenil y de adultos desde el enfoque cognitivo-conductual.",
      description:
        "Psicología Clínica infanto-juvenil y de adultos, a partir de los 10 años, desde el enfoque cognitivo conductual, para dificultades de ansiedad, regulación emocional, autoestima, conducta, atención y habilidades sociales.",
      targetAudience: "Niños, niñas, adolescentes y adultos a partir de los 10 años.",
      objectives: "Elaboración de informes de acuerdo a lo que requiera el paciente, principalmente para colegios y otros profesionales que participen en el proceso terapéutico.",
      activities: "",
      order: 0,
      status: "PUBLISHED" as const,
    },
    {
      slug: "terapia-ocupacional",
      name: "Terapia Ocupacional",
      shortDescription: "Promoción de la independencia y la participación en las actividades cotidianas.",
      description:
        "La Terapia Ocupacional trabaja con personas de todas las edades que presentan dificultades para desenvolverse de manera autónoma y participar en sus actividades cotidianas. Aborda áreas como la motricidad, el procesamiento sensorial, la atención, la regulación emocional, las habilidades sociales, la autonomía personal, las actividades de la vida diaria, el juego, el aprendizaje y la participación laboral y social.",
      targetAudience: "Personas de todas las edades.",
      objectives: "Promover la independencia, la funcionalidad y la calidad de vida, desarrollando habilidades y adaptando el entorno según las necesidades de cada persona.",
      activities: "",
      order: 1,
      status: "PUBLISHED" as const,
    },
    {
      slug: "fonoaudiologia",
      name: "Fonoaudiología",
      shortDescription: "Evaluación e intervención en lenguaje, habla, comunicación, voz, audición y deglución.",
      description:
        "Evalúa, diagnostica e interviene en dificultades del lenguaje, habla, comunicación, voz, audición y deglución. Asimismo, aborda la selectividad alimentaria, promoviendo una alimentación segura y funcional y la exploración y aceptación progresiva de alimentos.\n\nSon especialistas en las áreas de autismo, trastorno de los sonidos del habla, trastorno del lenguaje, trastornos de la comunicación, motricidad orofacial, trastornos de la voz, hipoacusia, retraso del desarrollo, estimulación temprana y trastornos del área de deglución.",
      targetAudience: "Niños, niñas, adolescentes y adultos.",
      objectives: "",
      activities: "",
      order: 2,
      status: "PUBLISHED" as const,
    },
    {
      slug: "educacion-diferencial",
      name: "Educación Diferencial",
      shortDescription: "Apoyo a niños, niñas y estudiantes con necesidades educativas especiales.",
      description:
        "Está dirigido a niños, niñas y estudiantes que presentan necesidades educativas especiales de carácter transitorio o permanente, tales como Trastorno Específico del Lenguaje (TEL), dificultades específicas del aprendizaje, Trastorno del Espectro Autista (TEA), y discapacidad intelectual, auditiva o visual.",
      targetAudience: "Desde los 3 años en adelante.",
      objectives: "",
      activities: "",
      order: 3,
      status: "PUBLISHED" as const,
    },
    {
      slug: "psicopedagogia",
      name: "Psicopedagogía",
      shortDescription: "Apoyo en dificultades de aprendizaje, lectoescritura y hábitos de estudio.",
      description:
        "Trabajamos dificultades de aprendizaje transitorias, estimulación temprana de habilidades para el aprendizaje, adquisición y desarrollo de la lectoescritura, técnicas de adquisición de la escritura, estimulación cognitiva, reforzamiento pedagógico, comprensión lectora, técnicas de memorización, técnicas y hábitos de estudio, y desarrollo de la atención, memoria y concentración.\n\nAplicamos pruebas estandarizadas para la evaluación del aprendizaje y entregamos apoyo psicopedagógico para niños pequeños en etapa prelectora, preescolares, escolares, preadolescentes y adolescentes.",
      targetAudience: "Desde etapa prelectora hasta adolescencia.",
      objectives: "",
      activities: "",
      order: 4,
      status: "PUBLISHED" as const,
    },
    {
      slug: "acondicionamiento-fisico",
      name: "Acondicionamiento Físico",
      shortDescription: "Programa terapéutico de psicomotricidad y movimiento adaptado.",
      description:
        "Programa Terapéutico de Psicomotricidad y Movimiento Adaptado para niños neurodivergentes. A través del movimiento y el juego trabajamos distintas áreas del desarrollo: regulación sensorial y emocional, coordinación motora gruesa y fina, equilibrio, postura y conciencia corporal, planificación motora y seguimiento de instrucciones, interacción social, turnos y trabajo en equipo, y autonomía, confianza y tolerancia a la frustración.",
      targetAudience: "Niños y niñas neurodivergentes.",
      objectives: "",
      activities: "",
      order: 5,
      status: "PUBLISHED" as const,
    },
    {
      slug: "asistencia-social",
      name: "Asistencia Social",
      shortDescription: "Orientación social, informes sociales y apoyo en gestiones administrativas.",
      description:
        "Entregamos orientación social, informe social, peritaje socioeconómico e informe para credencial de discapacidad, acompañando a las familias en sus gestiones y necesidades específicas.",
      targetAudience: "Familias que requieren orientación y apoyo social.",
      objectives: "",
      activities: "",
      order: 6,
      status: "PUBLISHED" as const,
    },
    {
      slug: "evaluaciones",
      name: "Evaluaciones e Informes",
      shortDescription: "Evaluaciones estandarizadas e informes profesionales para colegios y especialistas.",
      description:
        "Elaboramos informes profesionales para establecimientos educacionales y especialistas tratantes, como neurólogos, según las necesidades de cada paciente. Aplicamos instrumentos de evaluación estandarizados, como ADOS-2 y WISC, de acuerdo con la formación, habilitación profesional y competencias correspondientes, entregando recomendaciones para favorecer el acompañamiento terapéutico y educativo.",
      targetAudience: "Niños, niñas, adolescentes y sus familias.",
      objectives: "",
      activities: "",
      order: 7,
      status: "PUBLISHED" as const,
    },
    {
      slug: "trabajo-con-colegios",
      name: "Trabajo con Colegios",
      shortDescription: "Talleres, capacitaciones e intervenciones para equipos educativos.",
      description:
        "Todo nuestro equipo de profesionales puede brindar talleres, cursos e intervenciones a colegios como apoyo en el área académica de niños y niñas neurodivergentes y neurotípicos. Realizamos evaluaciones psicopedagógicas y capacitaciones o charlas para profesores, equipos educativos y apoderados según la solicitud y necesidad de cada establecimiento.",
      targetAudience: "Colegios y establecimientos educacionales de Padre Hurtado, Maipú y otras comunas, según solicitud.",
      objectives: "",
      activities: "",
      order: 8,
      status: "PUBLISHED" as const,
    },
  ];

  for (const program of programs) {
    await prisma.program.upsert({
      where: { slug: program.slug },
      create: program,
      update: {},
    });
  }

  const teamMembers = [
    {
      name: "Tiare Pino",
      role: "Psicóloga",
      specialty: "Psicología Clínica infanto-juvenil y de adultos",
      experienceYears: 12,
      bio: "",
      showPhoto: false,
      isPlaceholder: false,
      order: 0,
      status: "PUBLISHED" as const,
    },
    {
      name: "Giovana Cordero",
      role: "Psicopedagoga",
      specialty: "Psicopedagogía",
      experienceYears: 12,
      bio: "",
      showPhoto: false,
      isPlaceholder: false,
      order: 1,
      status: "PUBLISHED" as const,
    },
    {
      name: "Profesional por confirmar",
      role: "Fonoaudióloga",
      specialty: "Fonoaudiología",
      experienceYears: null,
      bio: "",
      showPhoto: false,
      isPlaceholder: true,
      order: 2,
      status: "DRAFT" as const,
    },
    {
      name: "Profesional por confirmar",
      role: "Terapeuta Ocupacional",
      specialty: "Terapia Ocupacional",
      experienceYears: null,
      bio: "",
      showPhoto: false,
      isPlaceholder: true,
      order: 3,
      status: "DRAFT" as const,
    },
    {
      name: "Profesional por confirmar",
      role: "Trabajadora Social",
      specialty: "Asistencia Social",
      experienceYears: null,
      bio: "",
      showPhoto: false,
      isPlaceholder: true,
      order: 4,
      status: "DRAFT" as const,
    },
    {
      name: "Profesional por confirmar",
      role: "Educadora Diferencial",
      specialty: "Educación Diferencial",
      experienceYears: null,
      bio: "",
      showPhoto: false,
      isPlaceholder: true,
      order: 5,
      status: "DRAFT" as const,
    },
  ];

  for (const member of teamMembers) {
    const existing = await prisma.teamMember.findFirst({
      where: { name: member.name, role: member.role },
    });
    if (!existing) {
      await prisma.teamMember.create({ data: member });
    }
  }

  const faqs = [
    {
      question: "¿Cómo solicito una hora de atención?",
      answer: "Las horas se solicitan directamente por WhatsApp a nuestro número de contacto. Dependiendo de la disponibilidad, puedes obtener una hora entre 2 y 5 días, o incluso antes si hay disponibilidad inmediata.",
      order: 0,
      status: "PUBLISHED" as const,
    },
    {
      question: "¿Qué modalidades de atención ofrecen?",
      answer: "Ofrecemos atención presencial, online, talleres grupales y charlas, de acuerdo a la solicitud y necesidad de cada familia o institución.",
      order: 1,
      status: "PUBLISHED" as const,
    },
    {
      question: "¿En qué comunas realizan atenciones?",
      answer: "Atendemos en Padre Hurtado y Maipú, y en cualquier otra comuna que lo solicite, según disponibilidad.",
      order: 2,
      status: "PUBLISHED" as const,
    },
    {
      question: "¿Qué pasa si necesito cancelar o cambiar mi hora?",
      answer: "Debes comunicarte con nuestro número de contacto para coordinar el cambio o la cancelación.",
      order: 3,
      status: "PUBLISHED" as const,
    },
    {
      question: "¿Qué profesionales conforman el equipo?",
      answer: "Nuestro equipo está conformado por psicóloga, fonoaudióloga, psicopedagoga, terapeuta ocupacional, trabajadora social y educadora diferencial, todas con más de 10 años de experiencia.",
      order: 4,
      status: "PUBLISHED" as const,
    },
  ];

  for (const faq of faqs) {
    const existing = await prisma.faqItem.findFirst({ where: { question: faq.question } });
    if (!existing) {
      await prisma.faqItem.create({ data: faq });
    }
  }

  console.log("Seed completado con contenido institucional real de Fundación HOCES.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

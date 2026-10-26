var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// cc.js
var CC_SIGN_MAP = { Ari: "Aries", Tau: "Tauro", Gem: "G\xE9minis", Can: "C\xE1ncer", Leo: "Leo", Vir: "Virgo", Lib: "Libra", Sco: "Escorpio", Sag: "Sagitario", Cap: "Capricornio", Aqu: "Acuario", Pis: "Piscis" };
var CC_HOUSE_MAP = { First_House: 1, Second_House: 2, Third_House: 3, Fourth_House: 4, Fifth_House: 5, Sixth_House: 6, Seventh_House: 7, Eighth_House: 8, Ninth_House: 9, Tenth_House: 10, Eleventh_House: 11, Twelfth_House: 12 };
var CC_PLANET_KEYS = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "chiron", "mean_lilith", "true_north_lunar_node", "true_south_lunar_node"];
var CC_PLANET_ES = { sun: "Sol", moon: "Luna", mercury: "Mercurio", venus: "Venus", mars: "Marte", jupiter: "J\xFApiter", saturn: "Saturno", uranus: "Urano", neptune: "Neptuno", pluto: "Plut\xF3n", chiron: "Quir\xF3n", mean_lilith: "Lilith", true_north_lunar_node: "Nodo Norte", true_south_lunar_node: "Nodo Sur" };
var CC_ASPECT_ES = { conjunction: "conjunci\xF3n", opposition: "oposici\xF3n", trine: "tr\xEDgono", square: "cuadratura", sextile: "sextil" };
var CC_ASP_NAME = { Sun: "Sol", Moon: "Luna", Mercury: "Mercurio", Venus: "Venus", Mars: "Marte", Jupiter: "J\xFApiter", Saturn: "Saturno", Uranus: "Urano", Neptune: "Neptuno", Pluto: "Plut\xF3n", Chiron: "Quir\xF3n", Mean_Lilith: "Lilith", True_North_Lunar_Node: "Nodo Norte", True_South_Lunar_Node: "Nodo Sur", Ascendant: "Ascendente", First_House: "Ascendente", Medium_Coeli: "Medio Cielo", Imum_Coeli: "Fondo del Cielo", Descendant: "Descendente", Seventh_House: "Descendente" };
var CC_EXCLUIR = /(Nodo|Quir|Lilith)/i;
var CC_MARK = "\u27E6FIN-CARTA-NATAL\u27E7";
var CC_TITULOS = ["**Tu identidad esencial**", "**Tu mente, tus emociones y tu comunicaci\xF3n**", "**El amor y tus v\xEDnculos**", "**Tu acci\xF3n, tu vocaci\xF3n y c\xF3mo constru\xEDs**", "**Tu expansi\xF3n, tus l\xEDmites y tu maduraci\xF3n**", "**Tus patrones dominantes y tus \xE1reas de vida**", "**S\xEDntesis transformadora**"];
var CC_SYSTEM = `Sos una astr\xF3loga especializada en astrolog\xEDa psicol\xF3gica y evolutiva. Tu marco de interpretaci\xF3n se basa en los siguientes principios fundamentales:

LA CARTA NATAL es un mapa evolutivo del alma, no un destino fijo. Muestra desde d\xF3nde viene el alma (puntos de pasado) y hacia d\xF3nde va su evoluci\xF3n en esta vida (puntos evolutivos).

PUNTOS DE PASADO (lo conocido, lo autom\xE1tico, lo que el alma trae): Luna (mecanismo de seguridad emocional aprendido en la infancia, el ni\xF1o interno), Nodo Sur (talentos naturales que frenan el crecimiento si se abusa de ellos), Plut\xF3n (el mayor apego del alma, lo que controla desde el inconsciente).

PUNTOS DE EVOLUCI\xD3N (lo nuevo, el camino del alma en esta vida): Sol (punto evolutivo central, la llama aut\xE9ntica que se viene a encender; algo a desarrollar, no algo ya dado), Ascendente (energ\xEDa nueva a integrar en la personalidad), Nodo Norte (la ense\xF1anza de esta encarnaci\xF3n).

SATURNO es punto de pasado, presente y futuro a la vez: sus desaf\xEDos son el veh\xEDculo de evoluci\xF3n.

QUIR\xD3N es la herida del sanador: el \xE1rea de dolor profundo que, trabajada, se vuelve el mayor don.

PRINCIPIOS DE INTERPRETACI\xD3N:
- Nunca predec\xEDs el futuro de manera determinista.
- Siempre habl\xE1s desde el autoconocimiento y el crecimiento.
- Us\xE1s castellano rioplatense, tono c\xE1lido, moderno, directo y profundo.
- Habl\xE1s de "vos" a la persona.
- Us\xE1s t\xEDtulos de secci\xF3n entre dobles asteriscos en l\xEDnea propia.
- NUNCA menciones autores, escuelas o metodolog\xEDas espec\xEDficas.`;
function ccAspectosRelevantes(aspects) {
  const norm = /* @__PURE__ */ __name((n) => {
    const s = String(n || "");
    return /^(ascendant|first_house|asc)$/i.test(s) ? "Ascendant" : s;
  }, "norm");
  const esAngulo = /* @__PURE__ */ __name((n) => /^(ascendant|medium_coeli|imum_coeli|descendant|seventh_house)$/i.test(n || ""), "esAngulo");
  const esSec = /* @__PURE__ */ __name((n) => /node|lilith|chiron/i.test(n || ""), "esSec");
  const LUM = ["Sun", "Moon", "Ascendant"];
  const PERS = ["Sun", "Moon", "Ascendant", "Mercury", "Venus", "Mars"];
  const LENTOS = ["Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
  const ORDEN = ["Sun", "Moon", "Ascendant", "Mercury", "Venus", "Mars"];
  const vistos = /* @__PURE__ */ new Set();
  return (aspects || []).filter((a) => ["conjunction", "opposition", "trine", "square", "sextile"].includes(a && a.aspect)).map((a) => ({ tipo: a.aspect, p1: norm(a.p1_name), p2: norm(a.p2_name), orbe: Math.abs(Number(a.orbit) || 0) })).filter((a) => Object.prototype.hasOwnProperty.call(CC_ASP_NAME, a.p1) && Object.prototype.hasOwnProperty.call(CC_ASP_NAME, a.p2)).filter((a) => {
    const tocaAng = esAngulo(a.p1) || esAngulo(a.p2);
    const ambosSec = esSec(a.p1) && esSec(a.p2);
    const tocaLum = LUM.includes(a.p1) || LUM.includes(a.p2);
    const lentoPers = LENTOS.includes(a.p1) && PERS.includes(a.p2) || LENTOS.includes(a.p2) && PERS.includes(a.p1);
    if (ambosSec && a.orbe >= 1) return false;
    if (tocaAng) return a.orbe < 6;
    if (a.orbe < 3) return true;
    if (tocaLum) return true;
    if (lentoPers && a.orbe < 5) return true;
    return false;
  }).filter((a) => !esSec(a.p1) && !esSec(a.p2)).filter((a) => {
    const k = [a.p1, a.p2].sort().join("|") + "|" + a.tipo;
    if (vistos.has(k)) return false;
    vistos.add(k);
    return true;
  }).sort((a, b) => {
    const rank = /* @__PURE__ */ __name((x) => {
      let m = 99;
      [x.p1, x.p2].forEach((p) => {
        const i = ORDEN.indexOf(p);
        if (i !== -1 && i < m) m = i;
      });
      return m;
    }, "rank");
    const ra = rank(a), rb = rank(b);
    return ra !== rb ? ra - rb : a.orbe - b.orbe;
  }).slice(0, 12);
}
__name(ccAspectosRelevantes, "ccAspectosRelevantes");
function ccNombreAsp(n) {
  return CC_ASP_NAME[n] || String(n);
}
__name(ccNombreAsp, "ccNombreAsp");
function ccConstruirBase(subject, aspects, nombre) {
  subject = subject || {};
  const planetas = CC_PLANET_KEYS.map((k) => {
    const p = subject[k];
    if (!p) return null;
    const sign = CC_SIGN_MAP[p.sign], house = CC_HOUSE_MAP[p.house];
    if (!sign || !house) return null;
    return `${CC_PLANET_ES[k]} en ${sign} casa ${house}${p.retrograde === true ? " (Rx)" : ""}`;
  }).filter(Boolean).filter((s) => !CC_EXCLUIR.test(s));
  const ascSign = CC_SIGN_MAP[subject.first_house && subject.first_house.sign] || "?";
  const top = ccAspectosRelevantes(aspects).map((a) => `${ccNombreAsp(a.p1)} ${CC_ASPECT_ES[a.tipo] || a.tipo} ${ccNombreAsp(a.p2)} (orbe ${a.orbe.toFixed(1)})`).join(", ");
  const sol = subject.sun, luna = subject.moon;
  const base = `Carta natal de ${nombre}:
Planetas: ${planetas.join(", ")}
Ascendente: ${ascSign}
Aspectos principales: ${top}`;
  return { base, top, solSign: CC_SIGN_MAP[sol && sol.sign] || "?", solHouse: CC_HOUSE_MAP[sol && sol.house] || "?", lunaSign: CC_SIGN_MAP[luna && luna.sign] || "?", lunaHouse: CC_HOUSE_MAP[luna && luna.house] || "?", ascSign };
}
__name(ccConstruirBase, "ccConstruirBase");
function ccPromptCartaCompleta(b, nombre) {
  const { base, solSign, solHouse, lunaSign, lunaHouse, ascSign } = b;
  return `${base}

Escrib\xED una CARTA NATAL COMPLETA para ${nombre}. Es una lectura NATAL: describe la estructura de personalidad y el potencial evolutivo que muestra la carta de nacimiento. NO es una lectura de momento actual.

PROP\xD3SITO EMOCIONAL (lo m\xE1s importante)
La carta tiene que ser c\xE1lida, cercana y emocionalmente significativa: mostrarle a ${nombre} c\xF3mo funciona, reconocer tensiones y un malestar posible, hacerla sentir comprendida y acompa\xF1ada, darle una primera orientaci\xF3n \xFAtil y dejar preguntas abiertas que inviten a profundizar. NUNCA un informe t\xE9cnico ni una lista fr\xEDa de rasgos. Tiene que tener impacto y gancho emocional real, no ser correcta pero gen\xE9rica.

VOZ Y TONO
- Segunda persona, de "vos", directo a ${nombre}. Nunca tercera persona ("este Sol"): dec\xED "tu Sol", "ten\xE9s", "pod\xE9s".
- Castellano rioplatense, c\xE1lido, humano, claro. Voseo consistente. Nada de t\xFA/eres/tienes ni "a ti/para ti/contigo".
- NUNCA nombres t\xE9cnicos de aspectos: prohibido "cuadratura", "tr\xEDgono", "sextil", "conjunci\xF3n", "oposici\xF3n", "orbe", "aspecto". Traduc\xED al efecto concreto en la vida.
- Neutralidad de g\xE9nero: no marques g\xE9nero cuando no haga falta; sin "/a" ni duplicaciones.

QU\xC9 S\xCD Y QU\xC9 NO (obligatoria \u2014 vale el SENTIDO de cada frase)
S\xCD pod\xE9s, y CONVIENE para que tenga impacto: nombrar TENDENCIAS, tensiones, necesidades, recursos y EXPERIENCIAS POSIBLES, siempre como posibilidad presente derivada de la carta. Ejemplo v\xE1lido: "Esta combinaci\xF3n podr\xEDa hacer que te resulte m\xE1s sencillo expresar lo que pens\xE1s que poner en palabras lo que sent\xEDs." Eso identifica un dolor posible y est\xE1 BIEN.
NO cruces esta frontera:
- Acontecimientos biogr\xE1ficos inventados ("desde chico aprendiste\u2026", "cuando eras chica\u2026").
- Causas psicol\xF3gicas o el porqu\xE9 profundo de una conducta (incluye explicar algo como evitaci\xF3n o resguardo: no digas "X te cuesta porque mostrarte se siente riesgoso"; nombr\xE1 la tendencia sin el porqu\xE9).
- Heridas dadas por confirmadas, diagn\xF3sticos, o afirmar una dificultad como hecho (us\xE1 "podr\xEDa costarte\u2026", "puede inclinar hacia\u2026", no "te cuesta").
- Lenguaje de destino: "vino/ven\xEDs a", "lo que ven\xEDs a desarrollar", "en esta vida", "esta vida te invita/te pide", "dejar huella", "tu misi\xF3n/tu prop\xF3sito es".

FORMULACIONES PROHIBIDAS Y SUS REEMPLAZOS (obligatoria)
- NO absolutos: prohibido "tensi\xF3n permanente", "siempre", "nunca", "todo el tiempo". Us\xE1 "una tensi\xF3n que puede aparecer", "por momentos".
- NO caracterizar/juzgar: prohibido decir que la persona es "dura", "fr\xEDa", "dram\xE1tica" como etiqueta. Habl\xE1 de PERCEPCI\xD3N o tendencia: en vez de "pod\xE9s mostrarte m\xE1s dura o fr\xEDa de lo que sos" \u2192 "la imagen que llega primero puede leerse como m\xE1s reservada o contenida de lo que sent\xEDs por dentro".
- NO generalizaciones de car\xE1cter: prohibido "cuando am\xE1s, am\xE1s con todo". Reformul\xE1 como posibilidad.
- BALANCE ELEMENTAL SIN D\xC9FICIT: una baja presencia de un elemento NO es falta de herramientas, capacidad ni sensibilidad. Prohibido "menos herramientas emocionales", "te cuesta sentir". Us\xE1 "ese registro recibe menos protagonismo natural en tu carta".
- NO tono destinal/imperativo: prohibido "Saturno pide que aprendas". Us\xE1 "esta posici\xF3n puede inclinar hacia\u2026".
- PREGUNTAS SIN PRESUPONER LA DIFICULTAD: no incrusten la carencia como premisa. Pregunt\xE1 abriendo desde la curiosidad, sin dar por hecho el problema.

RELACIONES SOLO DESDE LOS ASPECTOS CALCULADOS (obligatoria)
- Solo pod\xE9s afirmar una relaci\xF3n entre dos factores (un flujo f\xE1cil, una tensi\xF3n, un refuerzo, una fricci\xF3n) si ese par figura EXPL\xCDCITAMENTE en "Aspectos principales" de los datos. Esos factores incluyen planetas y \xC1NGULOS (Ascendente, Medio Cielo, Fondo del Cielo, Descendente).
- PROHIBIDO deducir relaciones por signo o elemento ("son los dos de aire, fluyen") e inventar "flujos f\xE1ciles", "choques" o "complemento" que no est\xE9n en la lista.
- La co-presencia en una misma casa pod\xE9s nombrarla como dato; pero cualquier DIN\xC1MICA entre dos factores requiere un aspecto en la lista. Nunca nombres el tipo t\xE9cnico del aspecto: traduc\xED su efecto.

SECUENCIA EMOCIONAL EN CADA \xC1REA (obligatoria; fluida, NO como lista visible)
1. Recurso o necesidad que muestra la carta. 2. Una tensi\xF3n o malestar POSIBLE (presente, como posibilidad), con impacto real. 3. Valid\xE1 las dos partes sin juzgarlas. 4. Primera comprensi\xF3n u orientaci\xF3n pr\xE1ctica (el COMIENZO de un aprendizaje). 5. Una pregunta o puerta abierta que abra exploraci\xF3n desde la curiosidad y NO d\xE9 por sentada la carencia. Vari\xE1 la formulaci\xF3n.

REGLA NATAL \u2014 SIN ACONTECIMIENTOS NI PREDICCI\xD3N (obligatoria)
- S\xCD pod\xE9s describir c\xF3mo funciona un patr\xF3n como tendencia atemporal.
- NO narres acontecimientos actuales ni futuros. PROHIBIDO: "est\xE1s atravesando", "en este momento", "actualmente", "lo que se viene", "este a\xF1o", "pr\xF3ximamente", "est\xE1s en una etapa donde".

SEPARACI\xD3N DE PRODUCTOS (obligatoria)
- Trabaj\xE1s: personalidad, emociones, mente, v\xEDnculos, acci\xF3n, vocaci\xF3n, recursos y patrones generales.
- NO nombres ni interpretes los Nodos, Quir\xF3n ni Lilith (son de Lectura Profunda).
- Los planetas exteriores (Urano, Neptuno, Plut\xF3n) pueden influir en una din\xE1mica dominante, pero traduc\xED su efecto SIN nombrarlos. NUNCA escribas el nombre de un exterior ni su ubicaci\xF3n: nombr\xE1 solo el efecto vivido.

ELEMENTOS Y MODALIDADES \u2014 NO INTERPRETAR (obligatoria)
- PROHIBIDO hablar de elementos o modalidades y de cualquier conclusi\xF3n de personalidad derivada de ellos: nada de predominio o carencia de fuego, tierra, aire o agua, ni de cardinal, fijo o mutable, ni "balance", ni "tu carta tiene mucho/poco de tal elemento". Trabaj\xE1 con las posiciones (signo + casa) y las relaciones (aspectos) calculadas, no con recuentos de elementos/modalidades.

REDACCI\xD3N
- Prohibido inventar palabras ("retroexperiencia") y f\xF3rmulas artificiales ("Tierra y Tierra"). Prohibido frases que no explican nada.
- Si un dato trae "(Rx)", traducilo solo como energ\xEDa que puede procesarse internamente antes de expresarse, y solo si aporta. Nunca uses "retr\xF3grado".
- Antes del marcador final, rele\xE9 mentalmente y reescrib\xED cualquier frase que cruce las prohibiciones.

BAJ\xC1 LA DENSIDAD ASTROL\xD3GICA Y NO REPITAS
- OBLIGATORIO: en "Tu identidad esencial" nombr\xE1 expl\xEDcitamente, UNA vez cada uno, tu Sol en ${solSign}, tu Luna en ${lunaSign} y tu Ascendente en ${ascSign} (con el signo). Despu\xE9s, y en el resto de las secciones, prioriz\xE1 el lenguaje natural y de experiencia, sin repetir a cada paso planeta/signo/casa. Entendible sin saber astrolog\xEDa.
- Cada din\xE1mica se desarrolla UNA vez. La vocaci\xF3n, la exigencia, la responsabilidad y la construcci\xF3n, principalmente en "Tu acci\xF3n, tu vocaci\xF3n y c\xF3mo constru\xEDs".

ESTRUCTURA \u2014 UNA APERTURA SIN T\xCDTULO + 7 SECCIONES CON T\xCDTULO (en este orden; integr\xE1 los planetas, sin sub-apartado por planeta). La apertura no usa lenguaje de destino.

(Apertura, SIN t\xEDtulo) 2-3 oraciones que le hablen directo a ${nombre} y toquen algo emocional que la haga sentir vista.

**Tu identidad esencial**
Nombr\xE1 expl\xEDcitamente, una vez cada uno, tu Sol en ${solSign} (casa ${solHouse}), tu Luna en ${lunaSign} (casa ${lunaHouse}) y tu Ascendente en ${ascSign}, e integralos como una sola identidad. Aplic\xE1 la secuencia emocional.

**Tu mente, tus emociones y tu comunicaci\xF3n**
C\xF3mo pens\xE1s, aprend\xE9s y te expres\xE1s, enlazado con tu forma de sentir. Aplic\xE1 la secuencia emocional.

**El amor y tus v\xEDnculos**
Qu\xE9 busc\xE1s y c\xF3mo te vincul\xE1s afectivamente. Aplic\xE1 la secuencia emocional.

**Tu acci\xF3n, tu vocaci\xF3n y c\xF3mo constru\xEDs**
C\xF3mo actu\xE1s y c\xF3mo constru\xEDs y sosten\xE9s en el mundo, incluida tu vocaci\xF3n y tu relaci\xF3n con la responsabilidad. \xDAnico lugar donde se desarrolla a fondo la exigencia y la construcci\xF3n. Aplic\xE1 la secuencia emocional.

**Tu expansi\xF3n, tus l\xEDmites y tu maduraci\xF3n**
D\xF3nde est\xE1 tu crecimiento y tu confianza, y d\xF3nde la vida te pide estructura y madurez. Si la vocaci\xF3n ya se desarroll\xF3 arriba, no la repitas. Aplic\xE1 la secuencia emocional.

**Tus patrones dominantes y tus \xE1reas de vida**
Describ\xED el modo general en que proces\xE1s la vida y las \xE1reas donde se concentra tu energ\xEDa usando SOLAMENTE las posiciones (signo + casa) y las relaciones (aspectos) m\xE1s relevantes de los datos \u2014las casas m\xE1s cargadas, los planetas m\xE1s aspectados\u2014, en lenguaje cotidiano. NO uses elementos ni modalidades. Cerr\xE1 conectando emocionalmente.

**S\xEDntesis transformadora**
Cerr\xE1 integrando todo (pod\xE9s usar subt\xEDtulos breves en negrita o listas cortas):
- Tres recursos centrales de tu carta.
- Tres patrones para observar, en clave de posibilidad presente (no de dificultad confirmada).
- Tu br\xFAjula personal: UNA frase de M\xC1XIMO 18 palabras, clara y bien redactada.
- Un primer paso posible, formulado como observaci\xF3n abierta que NO presupone que el patr\xF3n exista.
- Tres preguntas de integraci\xF3n que abran exploraci\xF3n desde la curiosidad y NO presupongan el problema.

Despu\xE9s de la S\xEDntesis transformadora, en una l\xEDnea nueva y sola, escrib\xED EXACTAMENTE este marcador y nada m\xE1s despu\xE9s: ${CC_MARK}

LONGITUD (interna \u2014 NUNCA la menciones ni la incluyas en la salida)
Extensi\xF3n natural, rango orientativo 1.600\u20132.100 palabras. M\xC1XIMO ABSOLUTO 2.200 que NO se supera bajo ninguna circunstancia. NO hay m\xEDnimo obligatorio ni relleno: si ya dijiste lo esencial con calidez y profundidad, cerr\xE1. Empez\xE1 directo con la apertura, sin encabezado general, sin "#", sin "---".`;
}
__name(ccPromptCartaCompleta, "ccPromptCartaCompleta");
function ccContar(t) {
  return (String(t).trim().match(/\S+/g) || []).length;
}
__name(ccContar, "ccContar");
function ccQuitarMarcador(raw) {
  return String(raw).replace(new RegExp("\\n*\\s*" + CC_MARK.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*$"), "").trim();
}
__name(ccQuitarMarcador, "ccQuitarMarcador");
function ccValidarEstructura(raw, stopReason) {
  const marcador = raw.includes(CC_MARK);
  const titulos = CC_TITULOS.filter((t) => raw.includes(t)).length;
  const limpio = ccQuitarMarcador(raw);
  const palabras = ccContar(limpio);
  return { marcador, titulos, palabras, end: stopReason === "end_turn", superaTecho: palabras > 2200, limpio };
}
__name(ccValidarEstructura, "ccValidarEstructura");
function ccGuardiaContenido(t) {
  if (/(cuadratura|tr[ií]gono|sextil|conjunci[oó]n|oposici[oó]n|\borbe\b)/i.test(t)) return { ok: false, motivo: "jerga-aspectos" };
  if (/\b(urano|neptuno|plut[oó]n)\b/i.test(t)) return { ok: false, motivo: "planeta-exterior" };
  if (/\b(nodo|quir[oó]n|lilith)\b/i.test(t)) return { ok: false, motivo: "nodo/quiron/lilith" };
  return { ok: true };
}
__name(ccGuardiaContenido, "ccGuardiaContenido");
function ccSumUsage(a, b) {
  a = a || {};
  b = b || {};
  return { input_tokens: (a.input_tokens || 0) + (b.input_tokens || 0), output_tokens: (a.output_tokens || 0) + (b.output_tokens || 0) };
}
__name(ccSumUsage, "ccSumUsage");
async function ccLlamarAnthropic(env, messages) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": env.ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "anthropic-beta": "prompt-caching-2024-07-31" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 8e3, system: [{ type: "text", text: CC_SYSTEM, cache_control: { type: "ephemeral" } }], messages })
  });
  const data = await res.json();
  const texto = data.content && Array.isArray(data.content) ? data.content.map((b) => b.text || "").join("") : "";
  return { texto, stop_reason: data.stop_reason, usage: data.usage, ok: res.ok };
}
__name(ccLlamarAnthropic, "ccLlamarAnthropic");
async function ccGenerar(env, prompt) {
  const r1 = await ccLlamarAnthropic(env, [{ role: "user", content: prompt }]);
  if (!r1.ok) return { completa: false, motivo: "api", usage: r1.usage, llamadas: 1 };
  let texto = r1.texto, stop = r1.stop_reason, usage = r1.usage, llamadas = 1, segunda = null;
  let est = ccValidarEstructura(texto, stop);
  let guard = ccGuardiaContenido(est.limpio);
  const cortada = !est.marcador || stop === "max_tokens";
  if (cortada) {
    segunda = "continuacion";
    const r2 = await ccLlamarAnthropic(env, [
      { role: "user", content: prompt },
      { role: "assistant", content: texto },
      { role: "user", content: "Continu\xE1 EXACTAMENTE desde donde cortaste: solo la parte faltante y el cierre, sin repetir ni reescribir nada de lo anterior ni volver a poner t\xEDtulos ya escritos. Termin\xE1 la carta y cerr\xE1 con " + CC_MARK + "." }
    ]);
    llamadas++;
    texto = texto + r2.texto;
    stop = r2.stop_reason;
    usage = ccSumUsage(usage, r2.usage);
  } else if (!guard.ok) {
    segunda = "reintento";
    const r2 = await ccLlamarAnthropic(env, [{ role: "user", content: prompt }]);
    llamadas++;
    texto = r2.texto;
    stop = r2.stop_reason;
    usage = ccSumUsage(usage, r2.usage);
  }
  est = ccValidarEstructura(texto, stop);
  guard = ccGuardiaContenido(est.limpio);
  const completa = est.marcador && est.titulos === 7 && est.end && !est.superaTecho && guard.ok;
  return { completa, texto: est.limpio, palabras: est.palabras, superaTecho: est.superaTecho, guard, titulos: est.titulos, marcador: est.marcador, stop, llamadas, segunda, usage };
}
__name(ccGenerar, "ccGenerar");
var CC_KV_PREFIX = "carta-completa:v2:";
async function ccGuardarLectura(env, data) {
  const token = crypto.randomUUID();
  const registro = {
    producto: data.producto || "carta-completa",
    pagoId: data.pagoId || "",
    email: data.email || "",
    nombre: data.nombre || "",
    content: data.content || "",
    ts: Date.now()
  };
  await env.PAGOS_KV.put(CC_KV_PREFIX + token, JSON.stringify(registro), { expirationTtl: 86400 });
  return token;
}
__name(ccGuardarLectura, "ccGuardarLectura");
async function ccConsumirLectura(env, token) {
  if (!token) return null;
  const key = CC_KV_PREFIX + String(token);
  const stored = await env.PAGOS_KV.get(key, "json");
  if (!stored) return null;
  await env.PAGOS_KV.delete(key);
  return stored;
}
__name(ccConsumirLectura, "ccConsumirLectura");

// worker.js
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
__name(esc, "esc");
var BAJA_URL = "https://cartasahora-proxy.cynthiacerg.workers.dev/baja";
function normEmail(e) {
  return String(e || "").toLowerCase().trim();
}
__name(normEmail, "normEmail");
function _hex(buf) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(_hex, "_hex");
async function sha256Hex(s) {
  return _hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));
}
__name(sha256Hex, "sha256Hex");
async function firmaBaja(env, email) {
  const secret = env.UNSUB_SECRET || env.ADMIN_SECRET;
  if (!secret) return null;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return _hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode("baja:" + normEmail(email))));
}
__name(firmaBaja, "firmaBaja");
async function urlBaja(env, email) {
  const e = normEmail(email), t = await firmaBaja(env, e);
  return t ? `${BAJA_URL}?e=${encodeURIComponent(e)}&t=${t}` : null;
}
__name(urlBaja, "urlBaja");
async function firmaBajaValida(env, email, t) {
  const esperada = await firmaBaja(env, email);
  if (!esperada || typeof t !== "string" || t.length !== esperada.length) return false;
  let diff = 0;
  for (let i = 0; i < t.length; i++) diff |= t.charCodeAt(i) ^ esperada.charCodeAt(i);
  return diff === 0;
}
__name(firmaBajaValida, "firmaBajaValida");
async function estaDadoDeBaja(env, email) {
  return !!await env.LEADS_KV.get("baja:" + await sha256Hex(normEmail(email)));
}
__name(estaDadoDeBaja, "estaDadoDeBaja");
async function cabecerasBaja(env, email) {
  const u = await urlBaja(env, email);
  return u ? { "List-Unsubscribe": `<${u}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } : void 0;
}
__name(cabecerasBaja, "cabecerasBaja");
async function pieBaja(env, email, motivo) {
  const u = await urlBaja(env, email);
  return u ? `Recib\xEDs este mail porque ${motivo} y aceptaste recibir novedades. Si no quer\xE9s recibir m\xE1s, <a href="${u}" style="color:#999;">date de baja ac\xE1</a>.` : `Recib\xEDs este mail porque ${motivo} y aceptaste recibir novedades. Si no quer\xE9s recibir m\xE1s, respond\xE9 este mail con la palabra <strong>BAJA</strong>.`;
}
__name(pieBaja, "pieBaja");
async function darDeBaja(env, email) {
  const e = normEmail(email);
  await env.LEADS_KV.put("baja:" + await sha256Hex(e), String(Date.now()));
  const raw = await env.LEADS_KV.get(`lead:${e}`);
  if (!raw) return;
  let lead;
  try {
    lead = JSON.parse(raw);
  } catch {
    return;
  }
  lead.acepta_marketing = false;
  lead.baja_ts = Date.now();
  const metadata = { ts: lead.timestamp, mkt: false, done: lead.seguimiento_enviado === true };
  if (lead.compra_ts) {
    metadata.compra_ts = lead.compra_ts;
    metadata.post = false;
  }
  await env.LEADS_KV.put(`lead:${e}`, JSON.stringify(lead), { expirationTtl: 60 * 60 * 24 * 365 * 2, metadata });
}
__name(darDeBaja, "darDeBaja");
function paginaBaja(titulo, cuerpo, status = 200) {
  return new Response(
    `<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${esc(titulo)} \xB7 Espacio Libra</title></head>
<body style="margin:0;background:#0a0a12;color:#f0ede8;font-family:Georgia,serif;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;">
<div style="max-width:440px;text-align:center;line-height:1.7;">
<p style="font-size:11px;letter-spacing:.3em;color:#82B366;text-transform:uppercase;margin:0 0 16px;">Espacio Libra</p>
<h1 style="font-weight:300;font-size:24px;margin:0 0 16px;">${esc(titulo)}</h1>${cuerpo}</div></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } }
  );
}
__name(paginaBaja, "paginaBaja");
var NOMBRES_PRODUCTO = {
  "pregunta": "Pregunta Puntual",
  "transitos": "Tr\xE1nsitos Actuales",
  "carta-completa": "Carta Natal Completa",
  "proposito-vida": "Prop\xF3sito de Vida",
  "revolucion-lunar": "Revoluci\xF3n Lunar",
  "revolucion-solar": "Revoluci\xF3n Solar",
  "sinastria": "Sinastr\xEDa",
  "lectura-profunda": "Lectura Profunda"
};
async function notificarCompraInterna(env, pagoId, datos) {
  try {
    const yaNotificado = await env.PAGOS_KV.get(`notif:${pagoId}`);
    if (yaNotificado) return;
    await env.PAGOS_KV.put(`notif:${pagoId}`, "1", { expirationTtl: 86400 });
    const prodNombre = NOMBRES_PRODUCTO[datos.producto] || datos.producto || "\u2014";
    const nombre = datos.nombre || "sin nombre";
    const cuandoAR = (/* @__PURE__ */ new Date()).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });
    const montoTxt = datos.monto != null && datos.monto !== "" ? `${datos.monto} ${datos.moneda || ""}`.trim() : "\u2014";
    const html = `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#222;">
  <h2 style="color:#8A4DAB;margin:0 0 16px;">\u{1F4AB} Nueva compra confirmada</h2>
  <table style="width:100%;border-collapse:collapse;font-size:15px;">
    <tr><td style="padding:8px 0;color:#888;width:140px;">Producto</td><td style="padding:8px 0;font-weight:bold;">${esc(prodNombre)}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Consultante</td><td style="padding:8px 0;">${esc(nombre)}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;">${esc(datos.email || "\u2014")}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Monto</td><td style="padding:8px 0;">${esc(montoTxt)}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Pasarela</td><td style="padding:8px 0;">${esc(datos.pasarela || "\u2014")}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">N\xB0 de operaci\xF3n</td><td style="padding:8px 0;">${esc(pagoId || "\u2014")}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Datos de nacimiento</td><td style="padding:8px 0;">${esc(datos.fecha || "\u2014")} ${esc(datos.hora || "")} \xB7 ${esc(datos.ciudad || "\u2014")}, ${esc(datos.pais || "\u2014")}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Fecha y hora</td><td style="padding:8px 0;">${cuandoAR} (ARG)</td></tr>
  </table>
</div>`;
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "Espacio Libra <cartas@espaciolibra.com>",
        to: ["cynthia@espaciolibra.com"],
        subject: `\u{1F4AB} Nueva compra \u2014 ${prodNombre} (${nombre})`,
        html
      })
    });
  } catch (e) {
    console.warn("Error notificaci\xF3n interna:", e.message);
  }
}
__name(notificarCompraInterna, "notificarCompraInterna");
async function notificarLecturaCortada(env, datos) {
  try {
    const prodNombre = NOMBRES_PRODUCTO[datos.producto] || datos.producto || "\u2014";
    const cuandoAR = (/* @__PURE__ */ new Date()).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });
    const html = `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#222;">
  <h2 style="color:#c0392b;margin:0 0 8px;">\u26A0\uFE0F Una lectura se cort\xF3 incompleta</h2>
  <p style="font-size:14px;color:#666;line-height:1.6;margin:0 0 16px;">
    La generaci\xF3n lleg\xF3 al tope de tokens y el texto qued\xF3 truncado. No se envi\xF3 por mail
    ni se guard\xF3 en cach\xE9. Conviene regenerarla y mandarla a mano.
  </p>
  <table style="width:100%;border-collapse:collapse;font-size:15px;">
    <tr><td style="padding:8px 0;color:#888;width:140px;">Producto</td><td style="padding:8px 0;font-weight:bold;">${esc(prodNombre)}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Consultante</td><td style="padding:8px 0;">${esc(datos.nombre || "\u2014")}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;">${esc(datos.email || "\u2014")}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">ID de pago</td><td style="padding:8px 0;">${esc(datos.pagoId || "\u2014")}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Tokens generados</td><td style="padding:8px 0;">${esc(datos.tokens ?? "\u2014")}</td></tr>
    <tr><td style="padding:8px 0;color:#888;">Fecha y hora</td><td style="padding:8px 0;">${cuandoAR} (ARG)</td></tr>
  </table>
</div>`;
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "Espacio Libra <cartas@espaciolibra.com>",
        to: ["cynthia@espaciolibra.com"],
        subject: `\u26A0\uFE0F Lectura cortada \u2014 ${prodNombre}`,
        html
      })
    });
  } catch (e) {
    console.warn("Error aviso lectura cortada:", e.message);
  }
}
__name(notificarLecturaCortada, "notificarLecturaCortada");
var SEGUIMIENTO_DELAY_MS = 2 * 60 * 60 * 1e3;
var POST_COMPRA_1_MS = 3 * 24 * 60 * 60 * 1e3;
var POST_COMPRA_2_MS = 10 * 24 * 60 * 60 * 1e3;
var CROSS_SELL = {
  "carta-completa": ["revolucion-solar", "transitos", "sinastria"],
  "lectura-profunda": ["revolucion-solar", "transitos", "sinastria"],
  "proposito-vida": ["revolucion-solar", "transitos", "sinastria"],
  "revolucion-solar": ["transitos", "carta-completa", "sinastria"],
  "revolucion-lunar": ["transitos", "carta-completa", "sinastria"],
  "transitos": ["carta-completa", "revolucion-solar", "sinastria"],
  "pregunta": ["carta-completa", "revolucion-solar", "transitos"],
  "sinastria": ["carta-completa", "revolucion-solar", "transitos"]
};
var PRODUCTO_INFO = {
  "carta-completa": { nombre: "Carta Natal Completa", precio: "$10.000", gancho: "el mapa profundo de tu personalidad, tus v\xEDnculos, tu vocaci\xF3n y los desaf\xEDos que marca tu carta" },
  "revolucion-solar": { nombre: "Revoluci\xF3n Solar", precio: "$15.000", gancho: "tu a\xF1o personal desde tu \xFAltimo cumplea\xF1os: qu\xE9 se activa, qu\xE9 viene y cu\xE1les son tus meses clave" },
  "transitos": { nombre: "Tr\xE1nsitos Actuales", precio: "$8.500", gancho: "qu\xE9 est\xE1n activando los planetas en tu carta ahora mismo y por qu\xE9 sent\xEDs lo que sent\xEDs" },
  "sinastria": { nombre: "Sinastr\xEDa \xB7 Compatibilidad", precio: "$15.000", gancho: "la qu\xEDmica real entre tu carta y la de otra persona: qu\xE9 los une, qu\xE9 los desaf\xEDa, el karma compartido" }
};
async function procesarSeguimientos(env) {
  const list = await env.LEADS_KV.list({ prefix: "lead:" });
  const ahora = Date.now();
  let enviados = 0;
  for (const k of list.keys) {
    if (enviados >= 50) break;
    const md = k.metadata;
    if (md) {
      if (md.mkt !== true) continue;
      if (md.done === true) continue;
      if (!md.ts || ahora - md.ts < SEGUIMIENTO_DELAY_MS) continue;
    }
    let lead;
    try {
      lead = JSON.parse(await env.LEADS_KV.get(k.name));
    } catch {
      continue;
    }
    if (!lead) continue;
    if (lead.acepta_marketing !== true) continue;
    if (await estaDadoDeBaja(env, lead.email)) {
      await darDeBaja(env, lead.email);
      continue;
    }
    if (lead.seguimiento_enviado === true) continue;
    if (!lead.timestamp || ahora - lead.timestamp < SEGUIMIENTO_DELAY_MS) continue;
    const ok = await enviarSeguimientoOferta(env, lead);
    if (ok) {
      lead.seguimiento_enviado = true;
      await env.LEADS_KV.put(k.name, JSON.stringify(lead), {
        expirationTtl: 60 * 60 * 24 * 365 * 2,
        metadata: { ts: lead.timestamp, mkt: lead.acepta_marketing === true, done: true }
      });
      enviados++;
    }
  }
  console.log(`Seguimientos enviados: ${enviados}`);
}
__name(procesarSeguimientos, "procesarSeguimientos");
function _limpiarCDATA(s) {
  return (s || "").replace("<![CDATA[", "").replace("]]>", "").trim();
}
__name(_limpiarCDATA, "_limpiarCDATA");
async function obtenerUltimaNotaSubstack(env) {
  try {
    const cached = await env.PAGOS_KV.get("substack-ultima-nota");
    if (cached) return JSON.parse(cached);
    const res = await fetch("https://cynthialibra.substack.com/feed", { headers: { "User-Agent": "EspacioLibra/1.0 (+cartasahora.espaciolibra.com)" } });
    if (!res.ok) return null;
    const xml = await res.text();
    const itemMatch = xml.match(/<item[\s\S]*?<\/item>/);
    if (!itemMatch) return null;
    const item = itemMatch[0];
    const tm = item.match(/<title[^>]*>([\s\S]*?)<\/title>/);
    const lm = item.match(/<link[^>]*>([\s\S]*?)<\/link>/);
    let titulo = tm ? _limpiarCDATA(tm[1]) : "";
    const link = lm ? _limpiarCDATA(lm[1]) : "";
    if (!titulo || !link) return null;
    if (titulo.length > 85) titulo = titulo.slice(0, 82).trim() + "\u2026";
    const nota = { titulo, link };
    await env.PAGOS_KV.put("substack-ultima-nota", JSON.stringify(nota), { expirationTtl: 60 * 60 * 3 });
    return nota;
  } catch (e) {
    console.warn("Error RSS Substack:", e.message);
    return null;
  }
}
__name(obtenerUltimaNotaSubstack, "obtenerUltimaNotaSubstack");
async function enviarSeguimientoOferta(env, lead) {
  try {
    const nombre = (lead.nombre || "").trim();
    const saludo = nombre ? `Hola ${esc(nombre)}` : "Hola";
    const link = lead.token ? "https://cartasahora.espaciolibra.com/?lead=" + encodeURIComponent(lead.token) : "https://cartasahora.espaciolibra.com/?nombre=" + encodeURIComponent(nombre);
    const ultimaNota = await obtenerUltimaNotaSubstack(env);
    const html = `
<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2a2a2a;line-height:1.7;">
  <p style="font-size:11px;letter-spacing:0.3em;color:#8A4DAB;text-transform:uppercase;margin:0 0 18px;">Espacio Libra \xB7 Astrolog\xEDa Evolutiva</p>
  <p>${saludo}:</p>
  <p>Hace un rato calculaste tu carta natal y viste solo una parte. Tu <strong>informe completo en PDF</strong> incluye el an\xE1lisis detallado de tu personalidad, v\xEDnculos, vocaci\xF3n y los desaf\xEDos que marca tu carta \u2014 toda la profundidad que estos 3 elementos solo empiezan a mostrar.</p>
  <p style="text-align:center;margin:28px 0;">
    <span style="font-size:26px;color:#8A4DAB;">$10.000</span>
    <span style="font-size:14px;color:#777;"> v\xEDa Mercado Pago</span>
  </p>
  <p style="text-align:center;margin:0 0 28px;">
    <a href="${link}" style="display:inline-block;padding:14px 32px;background:#82B366;color:#fff;text-decoration:none;border-radius:8px;font-family:Arial,sans-serif;font-size:14px;letter-spacing:0.08em;">Quiero mi informe completo</a>
  </p>
  ${ultimaNota ? `<p style="text-align:center;border-top:1px solid #eee;padding-top:18px;margin:24px 0 0;font-size:13px;color:#777;">\u{1F4D6} Mi \xFAltima nota: <a href="${ultimaNota.link}" style="color:#8A4DAB;text-decoration:none;">${esc(ultimaNota.titulo)}</a></p>` : ""}
  <p style="text-align:center;${ultimaNota ? "" : "border-top:1px solid #eee;"}padding-top:14px;margin:14px 0 0;">
    <a href="https://cynthialibra.substack.com/" style="color:#8A4DAB;text-decoration:none;font-size:13px;margin:0 8px;">Mis notas en Substack</a> \xB7
    <a href="https://www.instagram.com/cynthiacerg/" style="color:#8A4DAB;text-decoration:none;font-size:13px;margin:0 8px;">Instagram</a> \xB7
    <a href="https://www.facebook.com/espaciolibra.astro" style="color:#8A4DAB;text-decoration:none;font-size:13px;margin:0 8px;">Facebook</a>
  </p>
  <p style="font-size:12px;color:#999;padding-top:12px;margin-top:12px;">
    ${await pieBaja(env, lead.email, "pediste tu carta natal en Espacio Libra")}
  </p>
</div>`;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "Espacio Libra <cartas@espaciolibra.com>",
        to: [lead.email],
        reply_to: "cynthia@espaciolibra.com",
        subject: "Tu carta natal tiene m\xE1s para revelarte",
        headers: await cabecerasBaja(env, lead.email),
        html
      })
    });
    return res.ok;
  } catch (e) {
    console.warn("Error seguimiento oferta:", e.message);
    return false;
  }
}
__name(enviarSeguimientoOferta, "enviarSeguimientoOferta");
async function registrarCompra(env, email, producto) {
  try {
    const mail = (email || "").toLowerCase().trim();
    if (!mail || !mail.includes("@") || !producto) return;
    const key = `lead:${mail}`;
    const raw = await env.LEADS_KV.get(key);
    if (!raw) return;
    let lead;
    try {
      lead = JSON.parse(raw);
    } catch {
      return;
    }
    const compras = Array.isArray(lead.compras) ? lead.compras.slice() : [];
    if (!compras.includes(producto)) compras.push(producto);
    lead.compras = compras;
    lead.ultima_compra = producto;
    lead.compra_ts = Date.now();
    lead.seguimiento_enviado = true;
    lead.post_compra = { oferta: null, uno: false, dos: false };
    await env.LEADS_KV.put(key, JSON.stringify(lead), {
      expirationTtl: 60 * 60 * 24 * 365 * 2,
      metadata: {
        ts: lead.timestamp,
        mkt: lead.acepta_marketing === true,
        done: true,
        compra_ts: lead.compra_ts,
        post: true
      }
    });
  } catch (e) {
    console.warn("registrarCompra:", e.message);
  }
}
__name(registrarCompra, "registrarCompra");
function calcularOferta(lead) {
  const compras = Array.isArray(lead.compras) ? lead.compras : [];
  const base = lead.ultima_compra || compras[compras.length - 1];
  const candidatos = CROSS_SELL[base] || [];
  for (const c of candidatos) {
    if (!compras.includes(c)) return c;
  }
  return null;
}
__name(calcularOferta, "calcularOferta");
async function procesarPostCompra(env) {
  const list = await env.LEADS_KV.list({ prefix: "lead:" });
  const ahora = Date.now();
  let enviados = 0;
  for (const k of list.keys) {
    if (enviados >= 50) break;
    const md = k.metadata;
    if (md) {
      if (md.mkt !== true) continue;
      if (!md.compra_ts) continue;
      if (md.post !== true) continue;
      if (ahora - md.compra_ts < POST_COMPRA_1_MS) continue;
    }
    let lead;
    try {
      lead = JSON.parse(await env.LEADS_KV.get(k.name));
    } catch {
      continue;
    }
    if (!lead || lead.acepta_marketing !== true || !lead.compra_ts) continue;
    if (await estaDadoDeBaja(env, lead.email)) {
      await darDeBaja(env, lead.email);
      continue;
    }
    const pc = lead.post_compra || { oferta: null, uno: false, dos: false };
    const dt = ahora - lead.compra_ts;
    let cambiado = false, cerrar = false;
    if (!pc.uno && dt >= POST_COMPRA_1_MS) {
      const oferta = calcularOferta(lead);
      if (!oferta) {
        cerrar = true;
      } else if (await enviarCrossSell(env, lead, oferta, false)) {
        pc.oferta = oferta;
        pc.uno = true;
        cambiado = true;
        enviados++;
      }
    } else if (pc.uno && !pc.dos && dt >= POST_COMPRA_2_MS) {
      const compras = Array.isArray(lead.compras) ? lead.compras : [];
      if (pc.oferta && !compras.includes(pc.oferta)) {
        if (await enviarCrossSell(env, lead, pc.oferta, true)) {
          pc.dos = true;
          cambiado = true;
          enviados++;
        }
      } else {
        pc.dos = true;
        cambiado = true;
      }
    }
    if (cerrar || pc.dos || cambiado) {
      lead.post_compra = pc;
      const post = !(cerrar || pc.dos);
      await env.LEADS_KV.put(k.name, JSON.stringify(lead), {
        expirationTtl: 60 * 60 * 24 * 365 * 2,
        metadata: { ts: lead.timestamp, mkt: true, done: true, compra_ts: lead.compra_ts, post }
      });
    }
  }
  console.log(`Cross-sell post-compra enviados: ${enviados}`);
}
__name(procesarPostCompra, "procesarPostCompra");
async function enviarCrossSell(env, lead, producto, esRecordatorio) {
  try {
    const info = PRODUCTO_INFO[producto];
    if (!info || !lead.email) return false;
    const nombre = (lead.nombre || "").trim();
    const saludo = nombre ? `Hola ${esc(nombre)}` : "Hola";
    const link = lead.token ? `https://cartasahora.espaciolibra.com/?lead=${encodeURIComponent(lead.token)}&oferta=${encodeURIComponent(producto)}` : `https://cartasahora.espaciolibra.com/?nombre=${encodeURIComponent(nombre)}`;
    const intro = esRecordatorio ? `Te escribo de nuevo por si te qued\xF3 pendiente: tu <strong>${esc(info.nombre)}</strong> sigue esper\xE1ndote. Es ${info.gancho}.` : `Ya ten\xE9s tu lectura \u2014 y hay un paso m\xE1s que te va a encantar. Tu <strong>${esc(info.nombre)}</strong> es ${info.gancho}.`;
    const ultimaNota = await obtenerUltimaNotaSubstack(env);
    const html = `
<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2a2a2a;line-height:1.7;">
  <p style="font-size:11px;letter-spacing:0.3em;color:#8A4DAB;text-transform:uppercase;margin:0 0 18px;">Espacio Libra \xB7 Astrolog\xEDa Evolutiva</p>
  <p>${saludo}:</p>
  <p>${intro}</p>
  <p style="text-align:center;margin:28px 0 6px;">
    <span style="font-size:26px;color:#8A4DAB;">${info.precio}</span>
    <span style="font-size:14px;color:#777;"> v\xEDa Mercado Pago</span>
  </p>
  <p style="text-align:center;font-size:12px;color:#999;margin:0 0 22px;">Con tu carta ya calculada \u2014 no ten\xE9s que volver a cargar tus datos.</p>
  <p style="text-align:center;margin:0 0 28px;">
    <a href="${link}" style="display:inline-block;padding:14px 32px;background:#82B366;color:#fff;text-decoration:none;border-radius:8px;font-family:Arial,sans-serif;font-size:14px;letter-spacing:0.08em;">Quiero mi ${esc(info.nombre)}</a>
  </p>
  ${ultimaNota ? `<p style="text-align:center;border-top:1px solid #eee;padding-top:18px;margin:24px 0 0;font-size:13px;color:#777;">\u{1F4D6} Mi \xFAltima nota: <a href="${ultimaNota.link}" style="color:#8A4DAB;text-decoration:none;">${esc(ultimaNota.titulo)}</a></p>` : ""}
  <p style="text-align:center;${ultimaNota ? "" : "border-top:1px solid #eee;"}padding-top:14px;margin:14px 0 0;">
    <a href="https://cynthialibra.substack.com/" style="color:#8A4DAB;text-decoration:none;font-size:13px;margin:0 8px;">Mis notas en Substack</a> \xB7
    <a href="https://www.instagram.com/cynthiacerg/" style="color:#8A4DAB;text-decoration:none;font-size:13px;margin:0 8px;">Instagram</a> \xB7
    <a href="https://www.facebook.com/espaciolibra.astro" style="color:#8A4DAB;text-decoration:none;font-size:13px;margin:0 8px;">Facebook</a>
  </p>
  <p style="font-size:12px;color:#999;padding-top:12px;margin-top:12px;">
    ${await pieBaja(env, lead.email, "compraste una lectura en Espacio Libra")}
  </p>
</div>`;
    const subject = esRecordatorio ? `\u2726 Te qued\xF3 pendiente tu ${info.nombre}` : `\u2726 El siguiente paso de tu carta: ${info.nombre}`;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "Espacio Libra <cartas@espaciolibra.com>",
        to: [lead.email],
        reply_to: "cynthia@espaciolibra.com",
        subject,
        headers: await cabecerasBaja(env, lead.email),
        html
      })
    });
    return res.ok;
  } catch (e) {
    console.warn("Error cross-sell:", e.message);
    return false;
  }
}
__name(enviarCrossSell, "enviarCrossSell");
async function paypalWebhookVerificado(request, env, event) {
  try {
    if (!env.PAYPAL_WEBHOOK_ID) return false;
    const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });
    if (!tokenRes.ok) return false;
    const { access_token } = await tokenRes.json();
    const verifyRes = await fetch("https://api-m.paypal.com/v1/notifications/verify-webhook-signature", {
      method: "POST",
      headers: { "Authorization": `Bearer ${access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_algo: request.headers.get("paypal-auth-algo"),
        cert_url: request.headers.get("paypal-cert-url"),
        transmission_id: request.headers.get("paypal-transmission-id"),
        transmission_sig: request.headers.get("paypal-transmission-sig"),
        transmission_time: request.headers.get("paypal-transmission-time"),
        webhook_id: env.PAYPAL_WEBHOOK_ID,
        webhook_event: event
      })
    });
    if (!verifyRes.ok) return false;
    const v = await verifyRes.json();
    return v.verification_status === "SUCCESS";
  } catch (e) {
    console.warn("Error verificando webhook PayPal:", e.message);
    return false;
  }
}
__name(paypalWebhookVerificado, "paypalWebhookVerificado");
async function pagoAutorizado(env, pagoId, promoToken) {
  if (promoToken) {
    const tok = await env.PAGOS_KV.get(`promo-token:${promoToken}`);
    if (tok) return true;
  }
  if (pagoId) {
    const pago = await env.PAGOS_KV.get(`pago:${pagoId}`, "json");
    if (pago?.confirmado) return true;
  }
  return false;
}
__name(pagoAutorizado, "pagoAutorizado");
function _enmascararEmails(str) {
  return String(str).replace(
    /([A-Za-z0-9._%+-])[A-Za-z0-9._%+-]*(@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g,
    "$1***$2"
  );
}
__name(_enmascararEmails, "_enmascararEmails");
async function _logPagoMP(env, data) {
  try {
    const ts = (/* @__PURE__ */ new Date()).toISOString();
    const key = "mplog:" + ts + "-" + Math.random().toString(36).slice(2, 8);
    const safe = _enmascararEmails(JSON.stringify({ ts, ...data }));
    await env.PAGOS_KV.put(key, safe, { expirationTtl: 60 * 60 * 24 * 21 });
  } catch (_) {
  }
}
__name(_logPagoMP, "_logPagoMP");
var worker_default = {
  async fetch(request, env, ctx) {
    const ALLOWED_ORIGINS = [
      "https://cartasahora.espaciolibra.com",
      "http://localhost:8099",
      "http://127.0.0.1:8099"
    ];
    const origin = request.headers.get("Origin") || "";
    const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "";
    const corsHeaders = {
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    const url = new URL(request.url);
    const path = url.pathname;
    const json = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }), "json");
    if (env.RATE_LIMIT) {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const key = `rl:${ip}`;
      const cur = parseInt(await env.RATE_LIMIT.get(key) || "0");
      if (cur >= 30) return json({ error: "Demasiadas solicitudes. Esper\xE1 un minuto." }, 429);
      await env.RATE_LIMIT.put(key, String(cur + 1), { expirationTtl: 60 });
    }
    if (path === "/carta" && request.method === "POST") {
      try {
        const body = await request.json();
        const res = await fetch("https://astrologer.p.rapidapi.com/api/v5/chart/birth-chart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": "astrologer.p.rapidapi.com",
            "X-RapidAPI-Key": env.RAPIDAPI_KEY
          },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        return json(data);
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }
    if (path === "/revolucion-solar" && request.method === "POST") {
      try {
        const body = await request.json();
        const { subject, year, return_location, split_chart } = body;
        const OPCIONES_GRAFICO = [
          "show_degree_indicators",
          "show_aspect_icons",
          "show_zodiac_background_ring",
          "theme",
          "style",
          "active_points"
        ];
        const opciones = {};
        for (const k of OPCIONES_GRAFICO) if (body[k] !== void 0) opciones[k] = body[k];
        const payload = {
          subject,
          year: parseInt(year),
          return_location,
          // 'dual' = natal + revolución en la misma rueda
          wheel_type: "dual",
          language: "ES",
          // split_chart separa la rueda de las tablas: devuelve chart_wheel y
          // chart_grid en vez de un solo `chart`. El grafico entero es una tira
          // de 3:1 donde la rueda queda diminuta; para el mail queremos la rueda sola.
          ...split_chart ? { split_chart: true } : {},
          ...opciones
        };
        const res = await fetch("https://astrologer.p.rapidapi.com/api/v5/chart/solar-return", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": "astrologer.p.rapidapi.com",
            "X-RapidAPI-Key": env.RAPIDAPI_KEY
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        return json(data);
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }
    if (path === "/transitos-actuales" && request.method === "POST") {
      try {
        const body = await request.json();
        const { subject, transit } = body;
        const transitSubject = {
          name: "Transito",
          year: transit.year,
          month: transit.month,
          day: transit.day,
          hour: transit.hour,
          minute: transit.minute,
          longitude: transit.longitude,
          latitude: transit.latitude,
          timezone: transit.timezone,
          city: transit.city || "current",
          nation: transit.nation || "AR"
        };
        const res = await fetch("https://astrologer.p.rapidapi.com/api/v5/chart/birth-chart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": "astrologer.p.rapidapi.com",
            "X-RapidAPI-Key": env.RAPIDAPI_KEY
          },
          body: JSON.stringify({ subject: transitSubject })
        });
        const data = await res.json();
        return json(data);
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }
    if (path === "/interpretar" && request.method === "POST") {
      try {
        const body = await request.json();
        if (body.producto === "carta-completa" && body.chartData) {
          const autorizado = await pagoAutorizado(env, body.pagoId, body.promoToken);
          if (!autorizado) return json({ error: "Pago no verificado" }, 403);
          const nombre = String(body.nombre || "").replace(/[\r\n]+/g, " ").slice(0, 60).trim() || "vos";
          const b = ccConstruirBase(body.chartData.subject || {}, body.chartData.aspects || [], nombre);
          if (b.solSign === "?" || b.ascSign === "?") return json({ error: "Datos de carta incompletos" }, 400);
          const pago = body.pagoId ? await env.PAGOS_KV.get("pago:" + body.pagoId, "json") : null;
          const email = pago && pago.email || String(body.email || "").trim();
          const gen = await ccGenerar(env, ccPromptCartaCompleta(b, nombre));
          if (!gen.completa) {
            ctx.waitUntil(notificarLecturaCortada(env, { producto: "carta-completa", nombre, email: email || null, pagoId: body.pagoId, tokens: gen.usage && gen.usage.output_tokens }));
            return json({ completa: false, error: "No pudimos generar una lectura completa en este momento. Reintent\xE1 en un ratito." });
          }
          const token = await ccGuardarLectura(env, { producto: "carta-completa", pagoId: body.pagoId || "", email, nombre, content: gen.texto });
          return json({ completa: true, token, content: gen.texto, meta: { palabras: gen.palabras, llamadas: gen.llamadas } });
        }
        const esEsencial = (body.prompt || "").includes("LECTURA ESENCIAL GRATUITA");
        if (!esEsencial) {
          const autorizado = await pagoAutorizado(env, body.pagoId, body.promoToken);
          if (!autorizado) return json({ error: "Pago no verificado" }, 403);
        }
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": env.ANTHROPIC_KEY,
            "anthropic-version": "2023-06-01",
            "anthropic-beta": "prompt-caching-2024-07-31"
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            // 8000 es un techo, no una meta: las lecturas terminan solas mucho antes.
            // Con 4000 las cartas completas con muchos aspectos se cortaban a la mitad.
            max_tokens: esEsencial ? 1500 : 8e3,
            system: body.system ? [{ type: "text", text: body.system, cache_control: { type: "ephemeral" } }] : void 0,
            messages: [{ role: "user", content: body.prompt }]
          })
        });
        const data = await res.json();
        if (data.stop_reason === "max_tokens" && !esEsencial) {
          ctx.waitUntil((async () => {
            let pago = null;
            if (body.pagoId) {
              try {
                pago = await env.PAGOS_KV.get(`pago:${body.pagoId}`, "json");
              } catch {
              }
            }
            await notificarLecturaCortada(env, {
              producto: body.producto || pago?.producto,
              nombre: body.nombre || pago?.nombre,
              email: pago?.email,
              pagoId: body.pagoId,
              tokens: data.usage?.output_tokens
            });
          })());
        }
        return json(data);
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }
    if (path === "/enviar-lectura" && request.method === "POST") {
      try {
        const body = await request.json();
        const { lectura, promoToken, fecha, hora, ciudad, pais, rueda, posiciones } = body;
        let { email, nombre, producto } = body;
        let ccContent = null;
        if (body.token) {
          const stored = await ccConsumirLectura(env, body.token);
          if (!stored || !stored.content) return json({ error: "Token de lectura inv\xE1lido, ya usado o vencido." }, 403);
          ccContent = stored.content;
          producto = stored.producto || producto;
          nombre = stored.nombre || nombre;
          if (stored.email) email = stored.email;
        }
        const ruedaOk = typeof rueda === "string" && rueda.length > 0 && rueda.length < 3e6 && /^[A-Za-z0-9+/=]+$/.test(rueda);
        let esPrueba = false;
        if (promoToken) {
          const tok = await env.PAGOS_KV.get(`promo-token:${promoToken}`);
          if (tok) esPrueba = true;
        }
        const esEsencialGratis = producto === "esencial" && !!body.texto;
        if (!esPrueba && !esEsencialGratis && !ccContent) {
          const pago = body.pagoId ? await env.PAGOS_KV.get(`pago:${body.pagoId}`, "json") : null;
          if (!pago?.confirmado) {
            return json({ error: "Pago no confirmado" }, 403);
          }
        }
        const ipEnvio = request.headers.get("CF-Connecting-IP") || "unknown";
        const diaEnvio = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
        const envioKey = `envio:${ipEnvio}:${diaEnvio}`;
        const enviosHoy = parseInt(await env.RATE_LIMIT.get(envioKey) || "0");
        if (enviosHoy >= 10) {
          return json({ error: "L\xEDmite diario de env\xEDos alcanzado. Prob\xE1 ma\xF1ana." }, 429);
        }
        await env.RATE_LIMIT.put(envioKey, String(enviosHoy + 1), { expirationTtl: 60 * 60 * 24 });
        let texto = ccContent || body.texto || "";
        if (!texto) {
          const esEsencial = (lectura || "").includes("LECTURA ESENCIAL GRATUITA");
          const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": env.ANTHROPIC_KEY,
              "anthropic-version": "2023-06-01",
              "anthropic-beta": "prompt-caching-2024-07-31"
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-6",
              max_tokens: esEsencial ? 1500 : 8e3,
              system: body.system ? [{ type: "text", text: body.system, cache_control: { type: "ephemeral" } }] : void 0,
              messages: [{ role: "user", content: lectura }]
            })
          });
          const claudeData = await claudeRes.json();
          if (claudeData.stop_reason === "max_tokens") {
            console.warn("Lectura cortada por max_tokens en /enviar-lectura:", producto);
            ctx.waitUntil(notificarLecturaCortada(env, {
              producto,
              nombre,
              email,
              pagoId: body.pagoId,
              tokens: claudeData.usage?.output_tokens
            }));
            return json({ error: "La lectura qued\xF3 incompleta. Volv\xE9 a intentarlo." }, 500);
          }
          texto = claudeData.content?.map((b) => b.text || "").join("") || "";
        }
        if (email) {
          const productos = {
            "esencial": { nombre: "Lectura Esencial Gratuita", precio: "" },
            "carta-completa": { nombre: "Carta Natal Completa", precio: "$6 USD" },
            "revolucion-solar": { nombre: "Revoluci\xF3n Solar", precio: "$9 USD" },
            "sinastria": { nombre: "Sinastr\xEDa \u2014 Compatibilidad de Pareja", precio: "$9 USD" },
            "transitos": { nombre: "Tr\xE1nsitos Actuales", precio: "$5 USD" },
            "pregunta": { nombre: "Pregunta Puntual", precio: "$4 USD" },
            "lectura-profunda": { nombre: "Lectura Profunda \xB7 An\xE1lisis Completo", precio: "$13 USD" }
          };
          const prod = productos[producto] || { nombre: producto, precio: "" };
          const tituloRueda = producto === "revolucion-solar" ? "Tu revoluci\xF3n solar" : "Tu carta natal";
          const filas = Array.isArray(posiciones) ? posiciones.slice(0, 20) : [];
          const tablaPosiciones = filas.length ? `
    <div style="padding:8px 32px 28px;">
      <p style="font-size:11px;letter-spacing:0.15em;color:#aaa;text-transform:uppercase;margin:0 0 12px;text-align:center;font-family:Georgia,serif;">Posiciones de tu revoluci\xF3n solar</p>
      <table style="width:100%;border-collapse:collapse;font-family:Georgia,serif;font-size:14px;">
        ${filas.map((f, i) => `<tr style="background:${i % 2 ? "#faf9f7" : "#ffffff"};">
          <td style="padding:8px 10px;color:#5a5a5a;white-space:nowrap;">${esc(f.nombre)}</td>
          <td style="padding:8px 10px;color:#2a2a2a;font-weight:bold;">${esc(f.grado)} ${esc(f.signo)}${f.retro ? ' <span style="color:#c0392b;font-weight:normal;">\u211E</span>' : ""}</td>
          <td style="padding:8px 10px;color:#888;text-align:right;white-space:nowrap;">${f.casa ? "Casa " + esc(f.casa) : ""}</td>
        </tr>`).join("")}
      </table>
      <p style="font-size:11px;color:#bbb;margin:12px 0 0;text-align:center;font-family:Georgia,serif;">\u211E indica planeta retr\xF3grado</p>
    </div>` : "";
          const htmlLectura = texto.split("\n").map((linea) => {
            if (!linea.trim()) return "<br>";
            if (linea.startsWith("**") && linea.endsWith("**")) {
              return `<h2 style="color:#82B366;font-family:Georgia,serif;font-size:18px;margin:24px 0 8px;border-bottom:1px solid rgba(130,179,102,0.3);padding-bottom:6px;">${esc(linea).replace(/\*\*/g, "")}</h2>`;
            }
            return `<p style="margin:0 0 12px;line-height:1.8;color:#3a3a3a;">${esc(linea).replace(/\*\*/g, "")}</p>`;
          }).join("");
          const ultimaNota = await obtenerUltimaNotaSubstack(env);
          const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="background:#f5f3ef;margin:0;padding:0;font-family:'Georgia',serif;">
  <div style="max-width:620px;margin:0 auto;background:white;">
    <div style="background:#0a0a12;padding:40px 32px;text-align:center;">
      <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.3em;color:#82B366;text-transform:uppercase;margin:0 0 12px;">Espacio Libra</p>
      <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:300;color:#f0ede8;margin:0 0 8px;">${prod.nombre}</h1>
      <p style="font-size:13px;color:rgba(255,255,255,0.4);margin:0;">Lectura personal para ${esc(nombre)}</p>
    </div>
    <div style="padding:32px;border-bottom:1px solid #e8e4de;">
      <p style="font-size:15px;color:#5a5a5a;line-height:1.7;margin:0;">
        Hola <strong>${esc(nombre)}</strong>, tu lectura astrol\xF3gica est\xE1 lista.
        Tomate el tiempo que necesites para leerla \u2014 est\xE1 hecha especialmente para vos.
      </p>
    </div>
    ${ruedaOk ? `<div style="padding:28px 32px 4px;text-align:center;">
      <img src="cid:rueda-carta" alt="${esc(tituloRueda)}" width="440" style="width:100%;max-width:440px;height:auto;display:block;margin:0 auto;border-radius:8px;" />
      <p style="font-size:11px;letter-spacing:0.15em;color:#aaa;text-transform:uppercase;margin:12px 0 0;font-family:Georgia,serif;">${esc(tituloRueda)}</p>
    </div>` : ""}
    ${tablaPosiciones}
    <div style="padding:32px;">
      ${htmlLectura}
    </div>
    ${producto === "carta-completa" ? `<div style="background:#f9f7f4;padding:32px;text-align:center;border-top:1px solid #e8e4de;">
      <p style="font-size:14px;color:#5a5a5a;margin:0 0 8px;">\xBFQuer\xE9s ir m\xE1s profundo?</p>
      <p style="font-size:13px;color:#888;margin:0 0 20px;">An\xE1lisis completo de todos tus aspectos + coaching evolutivo \xB7 Solo USD 7 m\xE1s</p>
      <a href="https://cartasahora.espaciolibra.com?upgrade=lectura-profunda&nombre=${encodeURIComponent(nombre || "")}&fecha=${encodeURIComponent(fecha || "")}&hora=${encodeURIComponent(hora || "")}&ciudad=${encodeURIComponent(ciudad || "")}&pais=${encodeURIComponent(pais || "Argentina")}" style="display:inline-block;padding:14px 32px;background:#8A4DAB;color:white;text-decoration:none;border-radius:8px;font-size:13px;letter-spacing:0.1em;">\u2726 Quiero mi lectura profunda \xB7 USD 7</a>
      <p style="font-size:11px;color:#aaa;margin:12px 0 0;">Pago seguro v\xEDa PayPal \xB7 Entrega en menos de 5 min</p>
    </div>` : ""}
    <div style="padding:28px 32px;text-align:center;background:#0a0a12;">
      ${ultimaNota ? `<p style="margin:0 0 18px;font-family:Georgia,serif;"><span style="font-size:12px;color:rgba(255,255,255,0.45);">\u{1F4D6} Mi \xFAltima nota:</span> <a href="${ultimaNota.link}" style="color:#A5D96F;text-decoration:none;font-size:13px;">${esc(ultimaNota.titulo)}</a></p>` : ""}
      <p style="font-size:13px;color:rgba(255,255,255,0.65);margin:0 0 12px;font-family:Georgia,serif;">Seguime y no te pierdas nada \u2726</p>
      <p style="margin:0 0 16px;">
        <a href="https://cynthialibra.substack.com/" style="color:#82B366;text-decoration:none;font-size:13px;margin:0 10px;">Mis notas en Substack</a>
        <a href="https://www.instagram.com/cynthiacerg/" style="color:#82B366;text-decoration:none;font-size:13px;margin:0 10px;">Instagram</a>
        <a href="https://www.facebook.com/espaciolibra.astro" style="color:#82B366;text-decoration:none;font-size:13px;margin:0 10px;">Facebook</a>
      </p>
      <p style="font-size:10px;letter-spacing:0.2em;color:rgba(255,255,255,0.2);margin:0;">
        ESPACIO LIBRA \xB7 ASTROLOG\xCDA EVOLUTIVA \xB7 cartasahora.espaciolibra.com
      </p>
    </div>
  </div>
</body>
</html>`;
          const resendRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${env.RESEND_API_KEY}`
            },
            body: JSON.stringify({
              from: "Espacio Libra <cartas@espaciolibra.com>",
              to: [email],
              reply_to: "contacto@espaciolibra.com",
              subject: `\u2726 Tu ${prod.nombre} \u2014 Espacio Libra`,
              html: emailHtml,
              // content_id enlaza el adjunto con el <img src="cid:rueda-carta">
              ...ruedaOk ? {
                attachments: [{
                  filename: "carta-natal.png",
                  content: rueda,
                  content_type: "image/png",
                  content_id: "rueda-carta"
                }]
              } : {}
            })
          });
          if (!resendRes.ok) {
            const err = await resendRes.text();
            return json({ error: "Error al enviar email: " + err }, 500);
          }
        }
        return json({ ok: true, texto });
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }
    if (path === "/crear-pago-paypal" && request.method === "POST") {
      try {
        const body = await request.json();
        const { producto, nombre, email, fecha, hora, ciudad, pais, gclid, gbraid, wbraid } = body;
        const PRECIOS_USD = {
          "carta-completa": { monto: "6.00", titulo: "Carta Natal Completa" },
          "proposito-vida": { monto: "6.00", titulo: "Prop\xF3sito de Vida" },
          "transitos": { monto: "5.00", titulo: "Tr\xE1nsitos Actuales" },
          "pregunta": { monto: "4.00", titulo: "Pregunta Puntual" },
          "revolucion-solar": { monto: "9.00", titulo: "Revoluci\xF3n Solar" },
          "sinastria": { monto: "9.00", titulo: "Sinastr\xEDa" },
          "lectura-profunda": { monto: "13.00", titulo: "Lectura Profunda" },
          "revolucion-lunar": { monto: "9.00", titulo: "Revoluci\xF3n Lunar" }
        };
        const prod = PRECIOS_USD[producto];
        if (!prod) return json({ error: "Producto no v\xE1lido" }, 400);
        const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
          method: "POST",
          headers: {
            "Authorization": "Basic " + btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`),
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: "grant_type=client_credentials"
        });
        const tokenData = await tokenRes.json();
        if (!tokenRes.ok) return json({ error: "Error auth PayPal", detalle: tokenData, status: tokenRes.status }, 500);
        const accessToken = tokenData.access_token;
        const customId = JSON.stringify({ producto, nombre, email: email || "", fecha: fecha || "", hora: hora || "", ciudad: ciudad || "", pais: pais || "" });
        let successUrl = "https://cartasahora.espaciolibra.com/?lectura=ok&pasarela=paypal&producto=" + encodeURIComponent(producto) + "&nombre=" + encodeURIComponent(nombre) + "&fecha=" + encodeURIComponent(fecha || "") + "&hora=" + encodeURIComponent(hora || "") + "&ciudad=" + encodeURIComponent(ciudad || "") + "&pais=" + encodeURIComponent(pais || "");
        if (gclid) successUrl += "&gclid=" + encodeURIComponent(gclid);
        if (gbraid) successUrl += "&gbraid=" + encodeURIComponent(gbraid);
        if (wbraid) successUrl += "&wbraid=" + encodeURIComponent(wbraid);
        const cancelUrl = "https://cartasahora.espaciolibra.com/?pago=cancelado";
        const orderRes = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "PayPal-Request-Id": crypto.randomUUID()
          },
          body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [{
              custom_id: customId,
              description: prod.titulo,
              amount: { currency_code: "USD", value: prod.monto }
            }],
            application_context: {
              brand_name: "Espacio Libra",
              landing_page: "BILLING",
              user_action: "PAY_NOW",
              return_url: successUrl,
              cancel_url: cancelUrl
            }
          })
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok) return json({ error: orderData.message || "Error creando orden PayPal" }, 500);
        const approveLink = orderData.links?.find((l) => l.rel === "approve")?.href;
        if (!approveLink) return json({ error: "No se encontr\xF3 link de aprobaci\xF3n PayPal" }, 500);
        return json({ url: approveLink, orderId: orderData.id });
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }
    if (path === "/capturar-pago-paypal" && request.method === "POST") {
      try {
        const { orderId } = await request.json();
        if (!orderId) return json({ ok: false, error: "Falta orderId" }, 400);
        const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
          method: "POST",
          headers: {
            "Authorization": "Basic " + btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`),
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: "grant_type=client_credentials"
        });
        const tokenData = await tokenRes.json();
        if (!tokenRes.ok) return json({ ok: false, error: "Error auth PayPal" }, 500);
        const accessToken = tokenData.access_token;
        const captureRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "PayPal-Request-Id": `capture-${orderId}`
          }
        });
        const captureData = await captureRes.json();
        if (!captureRes.ok) return json({ ok: false, error: captureData.message || "Error al capturar", detalle: captureData }, 500);
        const status = captureData.status;
        if (status !== "COMPLETED") return json({ ok: false, error: `Estado inesperado: ${status}` }, 400);
        const unit = captureData.purchase_units?.[0];
        let meta = {};
        try {
          meta = JSON.parse(unit?.custom_id || "{}");
        } catch {
        }
        const capAmount = unit?.payments?.captures?.[0]?.amount || {};
        await env.PAGOS_KV.put(
          `pago:${orderId}`,
          JSON.stringify({
            confirmado: true,
            producto: meta.producto || "",
            nombre: meta.nombre || "",
            email: meta.email || "",
            fecha: meta.fecha || "",
            hora: meta.hora || "",
            ciudad: meta.ciudad || "",
            pais: meta.pais || "",
            pasarela: "paypal",
            monto: capAmount.value || 0,
            moneda: capAmount.currency_code || "USD",
            timestamp: Date.now()
          }),
          { expirationTtl: 86400 }
        );
        await notificarCompraInterna(env, orderId, {
          ...meta,
          pasarela: "paypal",
          monto: capAmount.value,
          moneda: capAmount.currency_code || "USD"
        });
        if (!await env.PAGOS_KV.get(`proc:${orderId}`)) {
          await env.PAGOS_KV.put(`proc:${orderId}`, "1", { expirationTtl: 60 * 60 * 24 * 30 });
          await registrarCompra(env, meta.email || "", meta.producto || "");
        }
        return json({ ok: true });
      } catch (e) {
        return json({ ok: false, error: e.message }, 500);
      }
    }
    if (path === "/webhook-paypal" && request.method === "POST") {
      try {
        const event = await request.json();
        const autentico = await paypalWebhookVerificado(request, env, event);
        if (!autentico) {
          console.warn("Webhook PayPal rechazado: firma no verificada");
          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
        if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
          const resource = event.resource;
          const orderId = resource.supplementary_data?.related_ids?.order_id || resource.id;
          let meta = {};
          try {
            meta = JSON.parse(resource.custom_id || "{}");
          } catch {
          }
          await env.PAGOS_KV.put(
            `pago:${orderId}`,
            JSON.stringify({
              confirmado: true,
              producto: meta.producto || "",
              nombre: meta.nombre || "",
              email: meta.email || "",
              fecha: meta.fecha || "",
              hora: meta.hora || "",
              ciudad: meta.ciudad || "",
              pais: meta.pais || "",
              pasarela: "paypal",
              monto: resource.amount?.value || 0,
              moneda: resource.amount?.currency_code || "USD",
              timestamp: Date.now()
            }),
            { expirationTtl: 86400 }
          );
          await notificarCompraInterna(env, orderId, {
            ...meta,
            pasarela: "paypal",
            monto: resource.amount?.value,
            moneda: resource.amount?.currency_code || "USD"
          });
          if (!await env.PAGOS_KV.get(`proc:${orderId}`)) {
            await env.PAGOS_KV.put(`proc:${orderId}`, "1", { expirationTtl: 60 * 60 * 24 * 30 });
            await registrarCompra(env, meta.email || "", meta.producto || "");
          }
        }
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (e) {
        return new Response("Error: " + e.message, { status: 500 });
      }
    }
    if (path === "/crear-pago-mp" && request.method === "POST") {
      let _logIn = null;
      let _mpBody = null;
      try {
        const body = await request.json();
        _logIn = body;
        const { producto, nombre, email, fecha, hora, ciudad, pais, gclid, gbraid, wbraid } = body;
        const PRECIOS_MP = {
          "pregunta": { monto: 6500, titulo: "Pregunta Puntual" },
          "transitos": { monto: 8500, titulo: "Tr\xE1nsitos Actuales" },
          "carta-completa": { monto: 1e4, titulo: "Carta Natal Completa" },
          "proposito-vida": { monto: 1e4, titulo: "Prop\xF3sito de Vida" },
          "revolucion-lunar": { monto: 1e4, titulo: "Revoluci\xF3n Lunar" },
          "revolucion-solar": { monto: 15e3, titulo: "Revoluci\xF3n Solar" },
          "sinastria": { monto: 15e3, titulo: "Sinastr\xEDa" },
          "lectura-profunda": { monto: 22e3, titulo: "Lectura Profunda" }
        };
        const prod = PRECIOS_MP[producto];
        if (!prod) {
          ctx.waitUntil(_logPagoMP(env, { in: _logIn, mpBody: null, status: 400, mpResp: null, error: "Producto no v\xE1lido" }));
          return json({ error: "Producto no v\xE1lido" }, 400);
        }
        const externalReference = JSON.stringify({ producto, nombre, email: email || "", fecha: fecha || "", hora: hora || "", ciudad: ciudad || "", pais: pais || "" });
        let successUrl = "https://cartasahora.espaciolibra.com/?lectura=ok&pasarela=mp&producto=" + encodeURIComponent(producto) + "&nombre=" + encodeURIComponent(nombre) + "&fecha=" + encodeURIComponent(fecha || "") + "&hora=" + encodeURIComponent(hora || "") + "&ciudad=" + encodeURIComponent(ciudad || "") + "&pais=" + encodeURIComponent(pais || "");
        if (gclid) successUrl += "&gclid=" + encodeURIComponent(gclid);
        if (gbraid) successUrl += "&gbraid=" + encodeURIComponent(gbraid);
        if (wbraid) successUrl += "&wbraid=" + encodeURIComponent(wbraid);
        _mpBody = {
          items: [{
            title: prod.titulo,
            quantity: 1,
            currency_id: "ARS",
            unit_price: prod.monto
          }],
          payer: { name: nombre, email: email || void 0 },
          external_reference: externalReference,
          back_urls: {
            success: successUrl,
            failure: "https://cartasahora.espaciolibra.com/?pago=cancelado",
            pending: "https://cartasahora.espaciolibra.com/?pago=pendiente"
          },
          auto_return: "approved",
          // Solo pagos instantáneos: sin efectivo/offline y sin estado "pending".
          // Los pagos en efectivo no vuelven al sitio y el cliente queda sin lectura.
          binary_mode: true,
          payment_methods: {
            excluded_payment_types: [
              { id: "ticket" },
              // efectivo (Rapipago, Pago Fácil)
              { id: "atm" }
              // pago en cajero / transferencia offline
            ]
          },
          notification_url: "https://cartasahora-proxy.cynthiacerg.workers.dev/webhook-mp"
        };
        const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.MP_ACCESS_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(_mpBody)
        });
        const mpData = await mpRes.json();
        ctx.waitUntil(_logPagoMP(env, {
          in: _logIn,
          mpBody: _mpBody,
          status: mpRes.status,
          mpResp: mpData,
          error: mpRes.ok ? null : mpData?.message || "Error creando preferencia MP"
        }));
        if (!mpRes.ok) return json({ error: mpData.message || "Error creando preferencia MP" }, 500);
        return json({ url: mpData.init_point, id: mpData.id });
      } catch (e) {
        ctx.waitUntil(_logPagoMP(env, { in: _logIn, mpBody: _mpBody, status: null, mpResp: null, error: "EXCEPTION: " + e.message }));
        return json({ error: e.message }, 500);
      }
    }
    if (path === "/webhook-mp" && request.method === "POST") {
      try {
        const body = await request.json();
        if (body.type === "payment" && body.data?.id) {
          const paymentId = body.data.id;
          const payRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: { "Authorization": `Bearer ${env.MP_ACCESS_TOKEN}` }
          });
          const payment = await payRes.json();
          if (payment.status === "approved") {
            const yaProcesado = await env.PAGOS_KV.get(`proc:${paymentId}`);
            if (yaProcesado) {
              return new Response(JSON.stringify({ received: true, duplicate: true }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
              });
            }
            await env.PAGOS_KV.put(`proc:${paymentId}`, "1");
            let meta = {};
            try {
              meta = JSON.parse(payment.external_reference || "{}");
            } catch {
            }
            await env.PAGOS_KV.put(
              `pago:${paymentId}`,
              JSON.stringify({
                confirmado: true,
                producto: meta.producto || "",
                nombre: meta.nombre || "",
                email: meta.email || payment.payer?.email || "",
                fecha: meta.fecha || "",
                hora: meta.hora || "",
                ciudad: meta.ciudad || "",
                pais: meta.pais || "",
                pasarela: "mercadopago",
                monto: payment.transaction_amount || 0,
                moneda: payment.currency_id || "ARS",
                timestamp: Date.now()
              }),
              { expirationTtl: 86400 }
            );
            await notificarCompraInterna(env, String(paymentId), {
              ...meta,
              email: meta.email || payment.payer?.email || "",
              pasarela: "mercadopago",
              monto: payment.transaction_amount,
              moneda: payment.currency_id || "ARS"
            });
            await registrarCompra(env, meta.email || payment.payer?.email || "", meta.producto || "");
          }
        }
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (e) {
        return new Response("Error: " + e.message, { status: 500 });
      }
    }
    if (path === "/validar-promo" && request.method === "POST") {
      try {
        const { codigo } = await request.json();
        const ingresado = (codigo || "").trim().toUpperCase();
        const valido = (env.PROMO_CODE || "").trim().toUpperCase();
        if (!valido || ingresado !== valido) {
          return json({ valido: false });
        }
        const mes = (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
        const contKey = `promo-uso:${mes}`;
        const usos = parseInt(await env.PAGOS_KV.get(contKey) || "0");
        if (usos >= 50) {
          return json({ valido: false, error: "limite_mensual" });
        }
        await env.PAGOS_KV.put(contKey, String(usos + 1), { expirationTtl: 60 * 60 * 24 * 40 });
        const token = crypto.randomUUID();
        await env.PAGOS_KV.put(`promo-token:${token}`, "1", { expirationTtl: 3600 });
        return json({ valido: true, token });
      } catch (e) {
        return json({ valido: false, error: e.message }, 500);
      }
    }
    if (path === "/verificar-pago" && request.method === "GET") {
      const sessionId = url.searchParams.get("session_id");
      if (!sessionId) return json({ confirmado: false, error: "Falta session_id" }, 400);
      const data = await env.PAGOS_KV.get(`pago:${sessionId}`, "json");
      const noStore = { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" };
      if (data?.confirmado) {
        return new Response(
          JSON.stringify({ confirmado: true, monto: data.monto || 0, moneda: data.moneda || "" }),
          { status: 200, headers: noStore }
        );
      }
      return new Response(JSON.stringify({ confirmado: false }), { status: 200, headers: noStore });
    }
    if (path === "/guardar-lead" && request.method === "POST") {
      try {
        const { email, nombre, acepta_marketing, nacimiento, cartaNatal, pagoId } = await request.json();
        if (!email || !email.includes("@")) return json({ error: "Email inv\xE1lido" }, 400);
        const key = `lead:${email.toLowerCase().trim()}`;
        let prev = {};
        try {
          prev = JSON.parse(await env.LEADS_KV.get(key)) || {};
        } catch {
        }
        const token = prev.token || crypto.randomUUID();
        const optIn = !!acepta_marketing;
        const hashBaja = "baja:" + await sha256Hex(normEmail(email));
        if (optIn && await env.LEADS_KV.get(hashBaja)) await env.LEADS_KV.delete(hashBaja);
        const lead = {
          ...prev,
          email,
          nombre: nombre || prev.nombre || "",
          acepta_marketing: optIn || !!prev.acepta_marketing,
          baja_ts: optIn ? void 0 : prev.baja_ts,
          token,
          nacimiento: nacimiento && nacimiento.fecha ? nacimiento : prev.nacimiento,
          cartaNatal: cartaNatal && cartaNatal.subject ? cartaNatal : prev.cartaNatal,
          timestamp: prev.timestamp || Date.now(),
          // no reiniciar el reloj del seguimiento
          seguimiento_enviado: prev.seguimiento_enviado || false
        };
        let compraRegistrada = false;
        if (pagoId) {
          let pago = null;
          try {
            pago = await env.PAGOS_KV.get(`pago:${pagoId}`, "json");
          } catch {
          }
          if (pago && pago.confirmado && pago.producto) {
            const compras = Array.isArray(lead.compras) ? lead.compras.slice() : [];
            if (!compras.includes(pago.producto)) compras.push(pago.producto);
            lead.compras = compras;
            lead.ultima_compra = pago.producto;
            lead.compra_ts = lead.compra_ts || Date.now();
            lead.seguimiento_enviado = true;
            lead.post_compra = lead.post_compra || { oferta: null, uno: false, dos: false };
            compraRegistrada = true;
          }
        }
        const ttl = { expirationTtl: 60 * 60 * 24 * 365 * 2 };
        const metadata = { ts: lead.timestamp, mkt: lead.acepta_marketing === true, done: lead.seguimiento_enviado === true };
        if (lead.compra_ts) {
          metadata.compra_ts = lead.compra_ts;
          metadata.post = lead.post_compra ? !(lead.post_compra.uno && lead.post_compra.dos) : true;
        }
        await env.LEADS_KV.put(key, JSON.stringify(lead), { ...ttl, metadata });
        await env.LEADS_KV.put(`lead-token:${token}`, email.toLowerCase().trim(), ttl);
        return json({ ok: true, token, compra: compraRegistrada });
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }
    if (path === "/lead" && request.method === "GET") {
      try {
        const token = url.searchParams.get("token");
        if (!token) return json({ error: "Falta token" }, 400);
        const email = await env.LEADS_KV.get(`lead-token:${token}`);
        if (!email) return json({ error: "no encontrado" }, 404);
        let lead = {};
        try {
          lead = JSON.parse(await env.LEADS_KV.get(`lead:${email}`)) || {};
        } catch {
        }
        return json({
          nombre: lead.nombre || "",
          email: lead.email || email,
          nacimiento: lead.nacimiento || null,
          cartaNatal: lead.cartaNatal || null
        });
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }
    if (path === "/baja" && (request.method === "GET" || request.method === "POST")) {
      const e = normEmail(url.searchParams.get("e"));
      const t = url.searchParams.get("t") || "";
      if (!e || !await firmaBajaValida(env, e, t)) {
        return paginaBaja(
          "Enlace no v\xE1lido",
          '<p style="color:#aaa;">Este enlace de baja no es v\xE1lido o est\xE1 incompleto. Escribinos a <a href="mailto:contacto@espaciolibra.com" style="color:#82B366;">contacto@espaciolibra.com</a> y te damos de baja a mano.</p>',
          400
        );
      }
      if (request.method === "GET") {
        return paginaBaja(
          "\xBFQuer\xE9s dejar de recibir novedades?",
          `<p style="color:#aaa;">Vamos a dar de baja a <strong>${esc(e)}</strong> de los mails comerciales de Espacio Libra.</p>
<form method="POST" action="${esc(BAJA_URL)}?e=${encodeURIComponent(e)}&t=${encodeURIComponent(t)}">
<button style="margin-top:12px;padding:14px 32px;background:#82B366;color:#fff;border:0;border-radius:8px;font-size:14px;letter-spacing:.08em;cursor:pointer;">Confirmar baja</button></form>`
        );
      }
      try {
        await darDeBaja(env, e);
        return paginaBaja(
          "Listo, quedaste de baja",
          '<p style="color:#aaa;">No vas a recibir m\xE1s mails comerciales. Los mails de una compra o lectura que pidas seguir\xE1n llegando.</p>'
        );
      } catch (err) {
        console.warn("Error baja:", err.message);
        return paginaBaja("No pudimos procesar la baja", '<p style="color:#aaa;">Prob\xE1 de nuevo en un rato o escribinos a contacto@espaciolibra.com.</p>', 500);
      }
    }
    if (path === "/listar-leads" && request.method === "GET") {
      const authHeader = request.headers.get("Authorization") || "";
      if (!env.ADMIN_SECRET || authHeader !== `Bearer ${env.ADMIN_SECRET}`) return json({ error: "No autorizado" }, 401);
      try {
        const list = await env.LEADS_KV.list({ prefix: "lead:" });
        const leads = await Promise.all(
          list.keys.map(async (k) => {
            const val = await env.LEADS_KV.get(k.name);
            try {
              return JSON.parse(val);
            } catch {
              return null;
            }
          })
        );
        return json({ leads: leads.filter(Boolean) });
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }
    return new Response("Not found", { status: 404, headers: corsHeaders });
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(procesarSeguimientos(env));
    ctx.waitUntil(procesarPostCompra(env));
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map

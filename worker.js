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
  const metadata = metaLead(lead, lead.compra_ts ? { post: false } : {});
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
var H_MS = 60 * 60 * 1e3;
var D_MS = 24 * H_MS;
// Secuencia de 5 mails para no-compradores. Solo entran los leads creados desde esta fecha de
// corte (fijada al desplegar, en UTC): los leads anteriores no reciben nada.
var SECUENCIA_DESDE = Date.parse("2026-11-01T21:38:42.629Z");
// Cuándo corresponde cada paso, contado desde lead.timestamp: 2 hs, día 2, 4, 6 y 8.
var SECUENCIA_OFFSETS_MS = [2 * H_MS, 2 * D_MS, 4 * D_MS, 6 * D_MS, 8 * D_MS];
// Control de activación por paso. Arrancan todos apagados hasta revisar los mails con
// /probar-secuencia. Mientras un paso esté en false los leads esperan en ese paso (no se saltean).
// Para activarlo, pasar a true y desplegar. Los pasos 3 y 4 tienen textos pendientes ({REVISAR} /
// {PEGAR}): aun en true, un mail con un marcador sin completar NO se envía.
var SECUENCIA_ACTIVOS = { 1: true, 2: true, 3: true, 4: true, 5: true };
// Separación mínima entre dos mails de la secuencia al mismo lead (evita ráfagas al reactivar un paso).
var SECUENCIA_ESPACIADO_MS = 48 * H_MS;
var BONUS_VENTANA_MS = 72 * H_MS;
var PRUEBA_SECUENCIA_DESTINO = "cynthiacerg@gmail.com";
var BONUS_TOKEN_TTL = 60 * 60 * 24 * 7;
var SITIO_URL = "https://cartasahora.espaciolibra.com/";
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
var MARCADOR_PENDIENTE_RE = /\{(REVISAR|PEGAR)/;
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
// Metadata de la clave lead:<mail> en LEADS_KV. TODOS los lugares que guardan un lead la arman acá,
// para que list() siempre vea lo mismo: ts, mkt, done (seguimiento terminado o cortado), sec (último
// paso de la secuencia enviado) y, si hubo compra, compra_ts + post (cross-sell pendiente).
function metaLead(lead, extra) {
  const m = {
    ts: lead.timestamp,
    mkt: lead.acepta_marketing === true,
    done: lead.seguimiento_enviado === true,
    sec: lead.secuencia && lead.secuencia.paso || 0
  };
  if (lead.compra_ts) {
    m.compra_ts = lead.compra_ts;
    m.post = lead.post_compra ? !(lead.post_compra.uno && lead.post_compra.dos) : true;
  }
  return Object.assign(m, extra || {});
}
__name(metaLead, "metaLead");
async function guardarLeadKV(env, lead, extraMeta) {
  await env.LEADS_KV.put(`lead:${normEmail(lead.email)}`, JSON.stringify(lead), {
    expirationTtl: 60 * 60 * 24 * 365 * 2,
    metadata: metaLead(lead, extraMeta)
  });
}
__name(guardarLeadKV, "guardarLeadKV");
async function procesarSeguimientos(env) {
  const list = await env.LEADS_KV.list({ prefix: "lead:" });
  const ahora = Date.now();
  const total = SECUENCIA_OFFSETS_MS.length;
  let enviados = 0;
  for (const k of list.keys) {
    if (enviados >= 50) break;
    const md = k.metadata;
    if (md) {
      if (md.mkt !== true || md.done === true) continue;
      if (!md.ts || md.ts < SECUENCIA_DESDE) continue;
      const p = md.sec || 0;
      if (p >= total || !SECUENCIA_ACTIVOS[p + 1]) continue;
      if (ahora - md.ts < SECUENCIA_OFFSETS_MS[p]) continue;
    }
    let lead;
    try {
      lead = JSON.parse(await env.LEADS_KV.get(k.name));
    } catch {
      continue;
    }
    if (!lead || lead.acepta_marketing !== true) continue;
    if (!lead.timestamp || lead.timestamp < SECUENCIA_DESDE) continue;
    if (await estaDadoDeBaja(env, lead.email)) {
      await darDeBaja(env, lead.email);
      continue;
    }
    if (lead.seguimiento_enviado === true) continue;
    if (Array.isArray(lead.compras) && lead.compras.length) {
      lead.seguimiento_enviado = true;
      await guardarLeadKV(env, lead);
      continue;
    }
    const paso = lead.secuencia && lead.secuencia.paso || 0;
    const sig = paso + 1;
    if (sig > total || !SECUENCIA_ACTIVOS[sig]) continue;
    if (ahora - lead.timestamp < SECUENCIA_OFFSETS_MS[paso]) continue;
    const ultimo = lead.secuencia && lead.secuencia.ultimo_ts;
    if (ultimo && ahora - ultimo < SECUENCIA_ESPACIADO_MS) continue;
    const opts = sig === total ? { hasta: ahora + BONUS_VENTANA_MS } : {};
    const ok = await enviarPasoSecuencia(env, lead, sig, opts);
    if (!ok) continue;
    lead.secuencia = { paso: sig, ultimo_ts: ahora };
    if (sig === total) {
      lead.bonus = { producto: "transitos", hasta: opts.hasta, usado: false };
      lead.seguimiento_enviado = true;
    }
    await guardarLeadKV(env, lead);
    enviados++;
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
var VENUS_TEXTOS = {
  Ari: "Am\xE1s con impulso. Cuando algo te atrae, vas, y esa franqueza es un regalo: no le hac\xE9s perder el tiempo a nadie. La sombra aparece cuando el entusiasmo se apaga apenas termina la conquista, o cuando la impaciencia no deja que el v\xEDnculo madure. El aprendizaje: sostener el fuego cuando ya no hay novedad.",
  Tau: "Am\xE1s con el cuerpo y con el tiempo. Necesit\xE1s constancia, gestos concretos, sentir que la otra persona est\xE1. Tu forma de querer da seguridad y calma. La sombra: aferrarte a lo conocido aunque ya no te nutra. El aprendizaje: confiar en que soltar no es perder.",
  Gem: "Am\xE1s conversando. Lo primero que te enamora es una mente que te despierte curiosidad, y con vos el v\xEDnculo se mantiene vivo a fuerza de juego, ideas y movimiento. La sombra: escaparte a la cabeza cuando aparece una emoci\xF3n inc\xF3moda. El aprendizaje: quedarte tambi\xE9n cuando la charla se pone seria.",
  Can: "Am\xE1s cuidando. Ten\xE9s una sensibilidad fina para registrar lo que el otro necesita, a veces antes que la otra persona misma, y sab\xE9s crear refugio. La sombra: dar para asegurarte de que no te dejen, o cerrarte cuando algo te lastima. El aprendizaje: pedir cuidado con la misma naturalidad con la que lo das.",
  Leo: "Am\xE1s con el coraz\xF3n a la vista. Tu forma de querer es c\xE1lida y generosa, y necesit\xE1s sentir que te eligen y te celebran. La sombra: cuando ese reconocimiento se vuelve la medida de todo, o cuando el orgullo no te deja mostrar fragilidad. El aprendizaje: brillar sin depender del aplauso del otro.",
  Vir: "Am\xE1s en los detalles. Tu cari\xF1o se nota en lo que hac\xE9s: recordar, resolver, estar en lo pr\xE1ctico. Quer\xE9s que el v\xEDnculo funcione y le pon\xE9s trabajo. La sombra: una exigencia, con vos o con el otro, que convierte el amor en una lista de cosas para corregir. El aprendizaje: aceptar que algo imperfecto tambi\xE9n puede ser suficiente.",
  Lib: "Am\xE1s buscando equilibrio. Ten\xE9s un talento natural para el encuentro, la armon\xEDa y la belleza compartida, y sab\xE9s ver al otro. La sombra: ceder tanto para evitar el conflicto que tu propio deseo queda en segundo plano. El aprendizaje: descubrir que un desacuerdo bien dicho tambi\xE9n acerca.",
  Sco: "Am\xE1s a fondo o no am\xE1s. Busc\xE1s intensidad, verdad, un v\xEDnculo que te transforme; lo superficial no te alcanza. La sombra: el miedo a la traici\xF3n que se vuelve control, o poner a prueba al otro para ver si se queda. El aprendizaje: confiar sin necesitar tener todo bajo control.",
  Sag: "Am\xE1s con libertad. Te atrae quien te abre el mundo: ideas, viajes, otra forma de mirar la vida. Con vos, el v\xEDnculo es crecimiento compartido. La sombra: que la b\xFAsqueda de lo que viene te haga perder lo que ya est\xE1. El aprendizaje: encontrar la aventura tambi\xE9n en la profundidad de lo cotidiano.",
  Cap: "Am\xE1s en serio. No te entreg\xE1s r\xE1pido, pero cuando lo hac\xE9s, constru\xEDs: tu forma de querer es leal, responsable, pensada a largo plazo. La sombra: una reserva emocional que hace que el otro no sepa cu\xE1nto te importa. El aprendizaje: dejar ver la ternura que hay detr\xE1s de la estructura.",
  Aqu: "Am\xE1s desde la libertad y la amistad. Necesit\xE1s un v\xEDnculo donde cada uno pueda seguir siendo quien es, y valor\xE1s la autenticidad por encima de cualquier convenci\xF3n. La sombra: tomar distancia emocional justo cuando el v\xEDnculo pide cercan\xEDa. El aprendizaje: descubrir que la intimidad no te quita libertad.",
  Pis: "Am\xE1s sin bordes. Ten\xE9s una empat\xEDa enorme y una capacidad de entrega casi total; ves lo mejor del otro, a veces antes de que exista. La sombra: idealizar, querer salvar, perderte en el otro. El aprendizaje: amar con la misma compasi\xF3n sin dejar tu propio lugar.",
  Generico: "Tu carta muestra una forma propia de vincularte: qu\xE9 te atrae, qu\xE9 necesit\xE1s para sentirte en confianza y qu\xE9 patrones se repiten cuando quer\xE9s a alguien. Entender eso no es para etiquetarte, es para dejar de repetir lo que ya no te hace bien y elegir con m\xE1s conciencia."
};
function textoVenus(lead) {
  const s = lead && lead.cartaNatal && lead.cartaNatal.subject && lead.cartaNatal.subject.venus && lead.cartaNatal.subject.venus.sign;
  return VENUS_TEXTOS[s] || VENUS_TEXTOS.Generico;
}
__name(textoVenus, "textoVenus");
function fechaLimiteAR(ms) {
  const f = new Date(ms).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires", weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", hour12: false });
  return f + " hs (hora de Argentina)";
}
__name(fechaLimiteAR, "fechaLimiteAR");
function botonMail(link, texto) {
  return `<p style="text-align:center;margin:0 0 28px;">
    <a href="${link}" style="display:inline-block;padding:14px 32px;background:#82B366;color:#fff;text-decoration:none;border-radius:8px;font-family:Arial,sans-serif;font-size:14px;letter-spacing:0.08em;">${texto}</a>
  </p>`;
}
__name(botonMail, "botonMail");
var PRECIO_CARTA_HTML = `<p style="text-align:center;margin:28px 0 22px;">
    <span style="font-size:26px;color:#8A4DAB;">$10.000</span>
    <span style="font-size:14px;color:#777;"> con Mercado Pago \xB7 USD 6 con PayPal</span>
  </p>`;
async function armarMailSecuencia(env, lead, paso, opts) {
  opts = opts || {};
  const nombre = (lead.nombre || "").trim();
  const saludo = nombre ? `Hola ${esc(nombre)}` : "Hola";
  let link = lead.token ? `${SITIO_URL}?lead=${encodeURIComponent(lead.token)}&oferta=carta-completa` : `${SITIO_URL}?nombre=${encodeURIComponent(nombre)}`;
  const firma = "<p>Cynthia</p>";
  let asunto, preheader, cuerpo;
  if (paso === 1) {
    asunto = "Tu carta natal tiene m\xE1s para mostrarte";
    preheader = "Lo que viste es la base. Hay mucho m\xE1s.";
    cuerpo = `<p>${saludo}:</p>
  <p>Hace un rato calculaste tu carta natal y le\xEDste la base: tu esencia, tu mundo emocional y la forma en que te mostr\xE1s al mundo.</p>
  <p>Es un buen comienzo, pero es una parte. Tu carta tambi\xE9n habla de c\xF3mo am\xE1s, c\xF3mo pens\xE1s y comunic\xE1s, c\xF3mo luch\xE1s por lo tuyo y qu\xE9 estructuras est\xE1s madurando en esta etapa.</p>
  <p>Todo eso est\xE1 en tu <strong>Carta Natal Completa</strong>. Ya tenemos tu carta calculada, as\xED que no ten\xE9s que volver a cargar tus datos.</p>
  ${PRECIO_CARTA_HTML}
  ${botonMail(link, "Ver mi Carta Completa")}
  <p>Cynthia<br>Espacio Libra</p>`;
  } else if (paso === 2) {
    asunto = "Algo de tu carta sobre c\xF3mo am\xE1s";
    preheader = "Un adelanto que no estaba en tu lectura gratuita.";
    cuerpo = `<p>${saludo}:</p>
  <p>Te quiero mostrar algo de tu carta que no apareci\xF3 en tu lectura gratuita: <strong>c\xF3mo am\xE1s</strong>.</p>
  <p>${textoVenus(lead)}</p>
  <p>Esto es solo una pieza. En tu Carta Completa se cruza con c\xF3mo pens\xE1s, c\xF3mo luch\xE1s por lo tuyo y qu\xE9 est\xE1s madurando. Ah\xED aparece el patr\xF3n entero, no solo un rasgo suelto.</p>
  ${botonMail(link, "Quiero ver mi carta entera")}
  ${firma}`;
  } else if (paso === 3) {
    asunto = "Tu carta no es un destino";
    preheader = "La forma en que trabajo y por qu\xE9.";
    cuerpo = `<p>${saludo}:</p>
  <p>Mucha gente se acerca a la astrolog\xEDa con miedo a que le digan algo malo, o con la sospecha de que va a recibir frases gen\xE9ricas que le sirven a cualquiera.</p>
  <p>Yo trabajo desde otro lugar. Para m\xED, tu carta natal no es un destino escrito: es un mapa de tus recursos, de tus patrones y de lo que est\xE1s aprendiendo en esta vida. No predice qu\xE9 te va a pasar; te ayuda a entender por qu\xE9 reaccion\xE1s como reaccion\xE1s y qu\xE9 pod\xE9s hacer distinto.</p>
  <p>Soy Cynthia, astr\xF3loga con certificaci\xF3n internacional, y me form\xE9 en astrolog\xEDa evolutiva y counseling astrol\xF3gico, para acompa\xF1ar procesos de transformaci\xF3n personal. Dise\xF1\xE9 Cartas Ahora para que cada lectura siga esta misma mirada: sin fatalismo, sin tecnicismos y hablando de tu vida concreta.</p>
  <p>Si tu lectura gratuita te reson\xF3, la Carta Completa es el paso siguiente.</p>
  ${botonMail(link, "Ver mi Carta Completa")}
  ${firma}`;
  } else if (paso === 4) {
    asunto = "Lo que hay del otro lado de los temas bloqueados";
    preheader = "Esto es lo que incluye tu Carta Completa.";
    cuerpo = `<p>${saludo}:</p>
  <p>Te cuento qu\xE9 recib\xEDs con tu Carta Natal Completa, para que sepas exactamente qu\xE9 hay antes de decidir:</p>
  <ul style="padding-left:20px;">
    <li><strong>Tu esencia, tu mundo emocional y c\xF3mo te mostr\xE1s</strong>, ahora en profundidad</li>
    <li><strong>C\xF3mo pens\xE1s y comunic\xE1s</strong></li>
    <li><strong>C\xF3mo am\xE1s y qu\xE9 busc\xE1s en un v\xEDnculo</strong></li>
    <li><strong>C\xF3mo luch\xE1s por lo tuyo</strong></li>
    <li><strong>D\xF3nde busc\xE1s crecer y expandirte</strong></li>
    <li><strong>Qu\xE9 estructuras est\xE1s madurando</strong></li>
    <li><strong>Los patrones que dominan tu carta</strong> y las \xE1reas de tu vida donde se juegan</li>
  </ul>
  <p>As\xED se lee un fragmento de una Carta Completa:</p>
  <blockquote style="border-left:3px solid #8A4DAB;margin:16px 0;padding:4px 16px;color:#555;font-style:italic;"><strong style="font-style:normal;color:#8A4DAB;">S\xEDntesis transformadora \xB7 Tres recursos centrales de tu carta</strong><br><br>- Una mente que conecta, articula y busca el matiz justo: la palabra es un terreno donde pod\xE9s brillar.<br><br>- Una capacidad de sentir con intensidad y de pensar con profundidad, dos registros que en vos conviven y pueden potenciarse.<br><br>- Una energ\xEDa expansiva y generosa en los v\xEDnculos, que busca encuentro real y reciprocidad genuina.</blockquote>
  <p>La recib\xEDs en el momento, en pantalla y en tu mail. No hace falta saber astrolog\xEDa.</p>
  ${PRECIO_CARTA_HTML}
  ${botonMail(link, "Quiero mi Carta Completa")}
  ${firma}`;
  } else {
    const hasta = opts.hasta || lead.bonus && lead.bonus.hasta || Date.now() + BONUS_VENTANA_MS;
    link += "&bonus=transitos";
    asunto = "Tu Carta Completa + Tr\xE1nsitos de regalo (72 hs)";
    preheader = "Tu mapa y lo que se est\xE1 activando ahora.";
    cuerpo = `<p>${saludo}:</p>
  <p>Durante estos d\xEDas te mostr\xE9 algunas partes de tu carta. Hoy te quiero hacer una propuesta.</p>
  <p>Si ped\xEDs tu <strong>Carta Natal Completa</strong> en las pr\xF3ximas 72 horas, te regalo tambi\xE9n tu lectura de <strong>Tr\xE1nsitos Actuales</strong> (valor $8.500): qu\xE9 est\xE1 moviendo este momento en tu carta y por qu\xE9 sent\xEDs lo que sent\xEDs.</p>
  <p>Las dos juntas se complementan: una te muestra tu mapa, la otra qu\xE9 parte de ese mapa se est\xE1 activando ahora.</p>
  <p style="text-align:center;margin:26px 0 8px;line-height:1.9;">
    <strong>Carta Completa: <span style="color:#8A4DAB;">$10.000</span></strong> <span style="font-size:14px;color:#777;">con Mercado Pago \xB7 USD 6 con PayPal</span><br>
    <strong>Tr\xE1nsitos Actuales: de regalo</strong>
  </p>
  <p style="text-align:center;">El regalo vale hasta el <strong>${esc(fechaLimiteAR(hasta))}</strong>.</p>
  ${botonMail(link, "Quiero mi carta + mi regalo")}
  ${firma}`;
  }
  const ultimaNota = await obtenerUltimaNotaSubstack(env);
  const html = `
<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2a2a2a;line-height:1.7;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#ffffff;">${esc(preheader)}</span>
  <p style="font-size:11px;letter-spacing:0.3em;color:#8A4DAB;text-transform:uppercase;margin:0 0 18px;">Espacio Libra \xB7 Astrolog\xEDa Evolutiva</p>
  ${cuerpo}
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
  return { subject: asunto, html };
}
__name(armarMailSecuencia, "armarMailSecuencia");
async function enviarPasoSecuencia(env, lead, paso, opts) {
  opts = opts || {};
  try {
    const { subject, html } = await armarMailSecuencia(env, lead, paso, opts);
    if (!opts.forzar && MARCADOR_PENDIENTE_RE.test(html)) {
      console.warn(`Secuencia paso ${paso}: texto con marcador sin completar, no se env\xEDa`);
      return false;
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "Espacio Libra <cartas@espaciolibra.com>",
        to: [opts.to || lead.email],
        reply_to: "cynthia@espaciolibra.com",
        subject: (opts.prefijoAsunto || "") + subject,
        headers: await cabecerasBaja(env, lead.email),
        html
      })
    });
    return res.ok;
  } catch (e) {
    console.warn(`Error secuencia paso ${paso}:`, e.message);
    return false;
  }
}
__name(enviarPasoSecuencia, "enviarPasoSecuencia");
// ── Bonus del mail 5: Tránsitos de regalo con la Carta Completa (72 hs) ──
// El pago identifica al lead por su TOKEN (lt, un UUID opaco que viaja en external_reference /
// custom_id), nunca por el mail de la pasarela. El worker decide: la URL (?bonus=) no autoriza nada.
async function resolverLeadEmail(env, meta) {
  const lt = meta && meta.lt;
  if (typeof lt !== "string" || !UUID_RE.test(lt)) return "";
  const e = await env.LEADS_KV.get("lead-token:" + lt);
  return e ? normEmail(e) : "";
}
__name(resolverLeadEmail, "resolverLeadEmail");
// external_reference (MP) y custom_id (PayPal) admiten ~255 caracteres: se recortan ciudad y
// nombre, en ese orden, antes que perder el token del lead.
function armarRefPago(meta) {
  const m = { ...meta };
  if (!(typeof m.lt === "string" && UUID_RE.test(m.lt))) delete m.lt;
  let s = JSON.stringify(m);
  for (const campo of ["ciudad", "nombre"]) {
    while (s.length > 250 && typeof m[campo] === "string" && m[campo].length > 8) {
      m[campo] = m[campo].slice(0, Math.max(8, m[campo].length - (s.length - 250)));
      s = JSON.stringify(m);
    }
  }
  return s;
}
__name(armarRefPago, "armarRefPago");
// Reserva el bonus para esta compra. Muta `lead` (el llamador lo persiste). Idempotente por pagoId.
async function activarBonusEnLead(env, lead, pagoId, ts) {
  const b = lead && lead.bonus;
  if (!b || b.producto !== "transitos" || b.usado === true || !pagoId) return false;
  if (b.pagoId) return b.pagoId === String(pagoId);
  if (!(ts <= b.hasta)) return false;
  b.pagoId = String(pagoId);
  b.token = crypto.randomUUID();
  await env.PAGOS_KV.put("bonus-token:" + b.token, JSON.stringify({ email: normEmail(lead.email), pagoId: b.pagoId, gen: false }), { expirationTtl: BONUS_TOKEN_TTL });
  try {
    const pago = await env.PAGOS_KV.get("pago:" + pagoId, "json");
    if (pago) {
      pago.bonus_token = b.token;
      await env.PAGOS_KV.put("pago:" + pagoId, JSON.stringify(pago), { expirationTtl: 86400 });
    }
  } catch (e) {
    console.warn("bonus: no se pudo marcar el pago:", e.message);
  }
  if (!b.mail_ts && await enviarMailRegalo(env, lead)) b.mail_ts = Date.now();
  return true;
}
__name(activarBonusEnLead, "activarBonusEnLead");
async function enviarMailRegalo(env, lead) {
  try {
    if (!lead.email || !lead.bonus || !lead.bonus.token) return false;
    const nombre = (lead.nombre || "").trim();
    const saludo = nombre ? `Hola ${esc(nombre)}` : "Hola";
    const link = `${SITIO_URL}?lead=${encodeURIComponent(lead.token || "")}&regalo=${encodeURIComponent(lead.bonus.token)}`;
    const html = `
<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2a2a2a;line-height:1.7;">
  <p style="font-size:11px;letter-spacing:0.3em;color:#8A4DAB;text-transform:uppercase;margin:0 0 18px;">Espacio Libra \xB7 Astrolog\xEDa Evolutiva</p>
  <p>${saludo}:</p>
  <p>Tu Carta Completa ya est\xE1 en camino y tu regalo tambi\xE9n: tu lectura de <strong>Tr\xE1nsitos Actuales</strong> te espera, sin costo.</p>
  <p>Si cerraste la p\xE1gina, pod\xE9s generarla desde ac\xE1 cuando quieras:</p>
  ${botonMail(link, "Generar mi Tr\xE1nsitos de regalo")}
  <p>Cynthia</p>
  <p style="font-size:12px;color:#999;border-top:1px solid #eee;padding-top:12px;margin-top:24px;">Recib\xEDs este mail porque compraste una Carta Completa con regalo en Espacio Libra.</p>
</div>`;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "Espacio Libra <cartas@espaciolibra.com>",
        to: [lead.email],
        reply_to: "cynthia@espaciolibra.com",
        subject: "✦ Tu regalo de Tr\xE1nsitos Actuales te espera",
        html
      })
    });
    return res.ok;
  } catch (e) {
    console.warn("Error mail regalo:", e.message);
    return false;
  }
}
__name(enviarMailRegalo, "enviarMailRegalo");
// Estado del token de bonus (null si no existe o ya generó su lectura).
async function bonusDisponible(env, token) {
  if (typeof token !== "string" || !UUID_RE.test(token)) return null;
  const rec = await env.PAGOS_KV.get("bonus-token:" + token, "json");
  return rec && !rec.gen ? rec : null;
}
__name(bonusDisponible, "bonusDisponible");
async function bonusToken(env, token) {
  if (typeof token !== "string" || !UUID_RE.test(token)) return null;
  return await env.PAGOS_KV.get("bonus-token:" + token, "json");
}
__name(bonusToken, "bonusToken");
// Marca el token como en uso ANTES de llamar al modelo (evita dos generaciones con un doble clic).
async function reservarBonus(env, token) {
  const rec = await bonusDisponible(env, token);
  if (!rec) return null;
  rec.gen = true;
  await env.PAGOS_KV.put("bonus-token:" + token, JSON.stringify(rec), { expirationTtl: BONUS_TOKEN_TTL });
  return rec;
}
__name(reservarBonus, "reservarBonus");
async function liberarBonus(env, token) {
  const rec = await bonusToken(env, token);
  if (!rec) return;
  rec.gen = false;
  await env.PAGOS_KV.put("bonus-token:" + token, JSON.stringify(rec), { expirationTtl: BONUS_TOKEN_TTL });
}
__name(liberarBonus, "liberarBonus");
// La lectura de regalo se generó bien: el lead pasa a "usado" y suma Tránsitos a sus compras
// (el cross-sell post-compra lo saltea y ofrece Revolución Solar). NO es una venta: sin purchase.
async function finalizarBonus(env, rec) {
  try {
    const raw = await env.LEADS_KV.get("lead:" + normEmail(rec.email));
    if (!raw) return;
    const lead = JSON.parse(raw);
    if (lead.bonus) lead.bonus.usado = true;
    const compras = Array.isArray(lead.compras) ? lead.compras.slice() : [];
    if (!compras.includes("transitos")) compras.push("transitos");
    lead.compras = compras;
    await guardarLeadKV(env, lead);
  } catch (e) {
    console.warn("bonus: no se pudo cerrar el bonus del lead:", e.message);
  }
}
__name(finalizarBonus, "finalizarBonus");
async function registrarCompra(env, email, producto, pago) {
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
    if (producto === "carta-completa" && pago && pago.id) await activarBonusEnLead(env, lead, pago.id, pago.ts || Date.now());
    await env.LEADS_KV.put(key, JSON.stringify(lead), {
      expirationTtl: 60 * 60 * 24 * 365 * 2,
      metadata: metaLead(lead)
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
        metadata: metaLead(lead, { mkt: true, done: true, post })
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
  ${esRecordatorio ? "" : '<p>Una cosa m\xE1s: \xBFc\xF3mo te result\xF3 tu lectura? Si respond\xE9s este mail con una o dos l\xEDneas, me ayuda much\xEDsimo. Lo leo yo.</p>'}
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
      let bonusTok = null, bonusRec = null;
      try {
        const body = await request.json();
        if (body.producto === "carta-completa" && body.chartData) {
          const autorizado = await pagoAutorizado(env, body.pagoId, body.promoToken);
          if (!autorizado) return json({ error: "Pago no verificado" }, 403);
          const nombre = String(body.nombre || "").replace(/[\r\n]+/g, " ").slice(0, 60).trim() || "vos";
          const b = ccConstruirBase(body.chartData.subject || {}, body.chartData.aspects || [], nombre);
          if (b.solSign === "?" || b.ascSign === "?") return json({ error: "Datos de carta incompletos" }, 400);
          const pago = body.pagoId ? await env.PAGOS_KV.get("pago:" + body.pagoId, "json") : null;
          const email = String(body.email || "").trim() || pago && pago.email || "";
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
          let autorizado = await pagoAutorizado(env, body.pagoId, body.promoToken);
          if (!autorizado && body.producto === "transitos" && body.promoToken) {
            // Regalo de Tránsitos (mail 5): token de un solo uso, válido SOLO para este producto.
            bonusRec = await reservarBonus(env, body.promoToken);
            if (bonusRec) {
              bonusTok = body.promoToken;
              autorizado = true;
            }
          }
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
        if (bonusTok) {
          const generoBien = data.stop_reason !== "max_tokens" && Array.isArray(data.content) && data.content.length > 0;
          const tok = bonusTok;
          bonusTok = null;
          if (generoBien) await finalizarBonus(env, bonusRec);
          else await liberarBonus(env, tok);
        }
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
        if (bonusTok) {
          try {
            await liberarBonus(env, bonusTok);
          } catch {
          }
        }
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
          if (!String(email || "").trim() && stored.email) email = stored.email;
        }
        const ruedaOk = typeof rueda === "string" && rueda.length > 0 && rueda.length < 3e6 && /^[A-Za-z0-9+/=]+$/.test(rueda);
        let esPrueba = false;
        if (promoToken) {
          const tok = await env.PAGOS_KV.get(`promo-token:${promoToken}`);
          if (tok) esPrueba = true;
          else if (producto === "transitos" && await bonusToken(env, promoToken)) esPrueba = true;
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
      <p style="font-size:13px;color:#888;margin:0 0 20px;">An\xE1lisis completo de todos tus aspectos + coaching evolutivo</p>
      <a href="https://cartasahora.espaciolibra.com?upgrade=lectura-profunda&nombre=${encodeURIComponent(nombre || "")}&fecha=${encodeURIComponent(fecha || "")}&hora=${encodeURIComponent(hora || "")}&ciudad=${encodeURIComponent(ciudad || "")}&pais=${encodeURIComponent(pais || "Argentina")}" style="display:inline-block;padding:14px 32px;background:#8A4DAB;color:white;text-decoration:none;border-radius:8px;font-size:13px;letter-spacing:0.1em;">\u2726 Quiero mi lectura profunda</a>
      <p style="font-size:11px;color:#aaa;margin:12px 0 0;">Pago seguro con Mercado Pago o PayPal. Entrega en menos de 5 min</p>
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
        const customId = armarRefPago({ producto, nombre, email: email || "", fecha: fecha || "", hora: hora || "", ciudad: ciudad || "", pais: pais || "", lt: body.lt });
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
          await registrarCompra(env, await resolverLeadEmail(env, meta) || meta.email || "", meta.producto || "", { id: orderId, ts: Date.now() });
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
            await registrarCompra(env, await resolverLeadEmail(env, meta) || meta.email || "", meta.producto || "", { id: orderId, ts: Date.now() });
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
        const externalReference = armarRefPago({ producto, nombre, email: email || "", fecha: fecha || "", hora: hora || "", ciudad: ciudad || "", pais: pais || "", lt: body.lt });
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
            await registrarCompra(env, await resolverLeadEmail(env, meta) || meta.email || payment.payer?.email || "", meta.producto || "", { id: String(paymentId), ts: Date.now() });
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
        let compraRegistrada = false, bonusActivo = false;
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
            // Compra desde otro dispositivo: si este lead tenía un bonus vigente al momento del pago,
            // escribir su mail lo recupera (el pago ya está confirmado en KV, el navegador solo pasa el id).
            if (pago.producto === "carta-completa") bonusActivo = await activarBonusEnLead(env, lead, pagoId, pago.timestamp || Date.now());
          }
        }
        const ttl = { expirationTtl: 60 * 60 * 24 * 365 * 2 };
        await env.LEADS_KV.put(key, JSON.stringify(lead), { ...ttl, metadata: metaLead(lead) });
        await env.LEADS_KV.put(`lead-token:${token}`, email.toLowerCase().trim(), ttl);
        return json({ ok: true, token, compra: compraRegistrada, bonus: bonusActivo });
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
        const b = lead.bonus;
        return json({
          nombre: lead.nombre || "",
          email: lead.email || email,
          nacimiento: lead.nacimiento || null,
          cartaNatal: lead.cartaNatal || null,
          // Aviso de la página (?bonus=transitos): solo si el bonus sigue vigente según el worker.
          bonus: b && b.producto === "transitos" && b.usado !== true && !b.pagoId && Date.now() <= b.hasta ? { hasta: b.hasta } : null
        });
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }
    if (path === "/reclamar-bonus" && request.method === "POST") {
      try {
        const { pagoId, token } = await request.json();
        let t = "";
        if (pagoId) {
          const pago = await env.PAGOS_KV.get(`pago:${pagoId}`, "json");
          if (pago?.confirmado && pago.producto === "carta-completa" && pago.bonus_token) t = pago.bonus_token;
        } else if (token) {
          t = String(token);
        }
        if (!t || !await bonusDisponible(env, t)) return json({ disponible: false });
        return json({ disponible: true, token: t });
      } catch (e) {
        return json({ disponible: false, error: e.message }, 500);
      }
    }
    if (path === "/probar-secuencia" && request.method === "POST") {
      const authHeader = request.headers.get("Authorization") || "";
      if (!env.ADMIN_SECRET || authHeader !== `Bearer ${env.ADMIN_SECRET}`) return json({ error: "No autorizado" }, 401);
      try {
        // Manda los 5 mails (o ?paso=N) SOLO a la casilla de prueba, con datos de ejemplo.
        // ?venus=Lib elige el texto del mail 2. Ignora el control de activación y los marcadores.
        const solo = parseInt(url.searchParams.get("paso") || "0");
        const venus = url.searchParams.get("venus") || "";
        const lead = {
          email: PRUEBA_SECUENCIA_DESTINO,
          nombre: "Cynthia",
          token: "00000000-0000-4000-8000-000000000000",
          cartaNatal: venus ? { subject: { venus: { sign: venus } } } : null
        };
        const resultados = {};
        for (let p = 1; p <= 5; p++) {
          if (solo && p !== solo) continue;
          resultados[p] = await enviarPasoSecuencia(env, lead, p, { to: PRUEBA_SECUENCIA_DESTINO, prefijoAsunto: `[PRUEBA ${p}/5] `, forzar: true, hasta: Date.now() + BONUS_VENTANA_MS });
        }
        return json({ destino: PRUEBA_SECUENCIA_DESTINO, enviados: resultados });
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

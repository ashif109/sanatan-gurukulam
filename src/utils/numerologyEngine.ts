export const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

export interface NumberDetail {
  number: number;
  name: string;
  vibe: string;
  personality: string;
  career: string;
  love: string;
  finance: string;
  health: string;
  strengths: string[];
  weaknesses: string[];
  growthAreas: string;
  luckyDays: string[];
  luckyColors: string[];
  luckyNumbers: number[];
  recommendedCareers: string[];
  leadershipStyle: string;
  communicationStyle: string;
}

export const KNOWLEDGE_BASE: Record<number, NumberDetail> = {
  1: {
    number: 1,
    name: "The Pioneer Leader",
    vibe: "Sun Energy, Independence, Ambition & Authority",
    personality: "Driven, independent, and creative. Number 1 individuals possess an innate urge to lead, innovate, and accomplish great feats. They excel in setting new directions and hate being controlled.",
    career: "Thrives in independent settings, executive positions, entrepreneurship, or creative direction. They are self-starters who prefer to run the show.",
    love: "Passionate and protective, though sometimes demanding. Needs a partner who respects their independence and shares their ambition.",
    finance: "Excellent earning capacity driven by ambitious pursuits. Needs to control impulsive spending on luxury status symbols.",
    health: "Generally robust constitution. Highly sensitive to mental stress. Prone to issues related to circulation, heart strain, or chronic tension.",
    strengths: ["Innovative", "Self-motivated", "Courageous", "Resilient", "Natural leader"],
    weaknesses: ["Impatient", "Egotistical", "Dominating", "Stubborn", "Aggressive"],
    growthAreas: "Cultivating genuine humility and learning to value collaborative efforts above solo achievements.",
    luckyDays: ["Sunday", "Monday"],
    luckyColors: ["Gold", "Yellow", "Copper"],
    luckyNumbers: [1, 9, 3],
    recommendedCareers: ["Entrepreneur", "CEO", "Inventor", "Politician", "Military Officer", "Creative Director"],
    leadershipStyle: "Authoritative, vision-led, leading from the front with absolute conviction.",
    communicationStyle: "Direct, assertive, and highly persuasive, focusing on the big picture."
  },
  2: {
    number: 2,
    name: "The Diplomatic Peacemaker",
    vibe: "Moon Energy, Sensitivity, Coordination & Intuition",
    personality: "Gentle, intuitive, and highly cooperative. Number 2 individuals seek harmony above all else. They are exceptional listeners, mediators, and supportive partners.",
    career: "Excels in collaborative work, psychology, counseling, human resources, artistic fields, and diplomacy where coordination is paramount.",
    love: "Deeply loyal, sensitive, and emotionally expressive. Craves romantic security, peaceful bonds, and mutually supportive relationships.",
    finance: "Stable earner through partnerships. May miss high-risk investment opportunities due to natural caution and security-first approach.",
    health: "Possesses a delicate physical system. Vulnerable to digestive system fluctuations, anxiety-driven fatigue, and fluid balance issues.",
    strengths: ["Empathetic", "Diplomatic", "Patient", "Intuitive", "Highly cooperative"],
    weaknesses: ["Overly sensitive", "Indecisive", "Timid", "Submissive", "Easily codependent"],
    growthAreas: "Learning to establish clear personal boundaries and speaking up confidently without fear of confrontation.",
    luckyDays: ["Monday", "Friday"],
    luckyColors: ["White", "Cream", "Silver", "Pale Green"],
    luckyNumbers: [2, 7, 9],
    recommendedCareers: ["Mediator", "Diplomat", "Counselor", "Artist", "Nurse", "HR Manager", "Social Worker"],
    leadershipStyle: "Cooperative, empathetic, guiding through relationship building and consensus.",
    communicationStyle: "Gentle, tactful, focused on listening and reconciling differing viewpoints."
  },
  3: {
    number: 3,
    name: "The Creative Communicator",
    vibe: "Jupiter Energy, Self-expression, Joy & Wealth of Knowledge",
    personality: "Highly expressive, optimistic, and socially vibrant. Number 3s are natural artists, writers, and speakers. They radiate a playful charm and lift the spirits of those around them.",
    career: "Fulfills their potential in marketing, writing, entertainment, teaching, legal fields, and public speaking where communication dominates.",
    love: "Vibrant, witty, and charming. Needs mental stimulation, light-hearted playfulness, and a partner who appreciates their creative spark.",
    finance: "Prone to financial fluctuations. Earns well but spends heavily on experiences, travels, and social entertainment.",
    health: "Generally good health. Prone to throat-related vulnerabilities, hoarseness, skin sensitivities, or nervous exhaustion.",
    strengths: ["Eloquent", "Creative", "Charismatic", "Optimistic", "Enthusiastic"],
    weaknesses: ["Scattered", "Overly dramatic", "Superficial times", "Extravagant", "Impulsive"],
    growthAreas: "Focusing scattered creative energies onto single, structured long-term objectives instead of chasing butterflies.",
    luckyDays: ["Thursday", "Friday", "Tuesday"],
    luckyColors: ["Yellow", "Orange", "Saffron", "Gold"],
    luckyNumbers: [3, 1, 9],
    recommendedCareers: ["Speaker", "Author", "Teacher", "PR Executive", "Actor", "Lawyer", "Creative Designer"],
    leadershipStyle: "Expressive and inspirational, driving teams with high enthusiasm and educational vision.",
    communicationStyle: "Dynamic, storytelling-based, captivating, filled with warmth and humor."
  },
  4: {
    number: 4,
    name: "The Master Architect",
    vibe: "Rahu/Uranus Energy, Discipline, Structure & Grounded Truths",
    personality: "Methodical, practical, and incredibly disciplined. Number 4s represent stability, structure, and hard work. They build clean systems, respect order, and are exceptionally reliable.",
    career: "Flourishes in engineering, finance, architecture, law, logistics, or operations where detailed execution is highly valued.",
    love: "Steadfast, protective, and committed. Prefers deep, long-term bonds over fleeting romances. Expresses love through practical acts of service.",
    finance: "Highly methodical budgeters. Accumulates wealth slowly and securely through safe real-estate, systematic deposits, or low-risk assets.",
    health: "Incredible physical endurance. Vulnerable to joint issues, bone density constraints, or chronic stress-induced backaches.",
    strengths: ["Disciplined", "Pragmatic", "Loyal", "Systematic", "Extremely reliable"],
    weaknesses: ["Rigid", "Dogmatic", "Skeptical", "Workaholic", "Resistant to change"],
    growthAreas: "Learning to embrace spontaneity, release strict control, and welcome unexpected change as an opportunity.",
    luckyDays: ["Saturday", "Sunday"],
    luckyColors: ["Blue", "Grey", "Electric Blue", "Navy"],
    luckyNumbers: [4, 8, 1],
    recommendedCareers: ["Engineer", "Project Manager", "Architect", "Financial Analyst", "Logistics Director", "Researcher"],
    leadershipStyle: "Process-driven, protective, organizing with structural precision and accountability.",
    communicationStyle: "Factual, straightforward, precise, keeping expectations highly structured."
  },
  5: {
    number: 5,
    name: "The Versatile Adventurer",
    vibe: "Mercury Energy, Freedom, Wit, Communication & Travel",
    personality: "Dazzling speed, wit, and versatility. Number 5s represent pure movement, adaptation, and freedom. They are highly resourceful, quick learners, and love exploring physical and mental landscapes.",
    career: "Excels in sales, journalism, consulting, travel industries, or technological research where fast change and high adaptability are mandatory.",
    love: "Exhilarating, dynamic, and freedom-loving. Needs space, intellectual chemistry, and a partner who handles their spontaneous nature.",
    finance: "Highly opportunistic earner. Able to generate money quickly through smart ventures, but equally capable of fast specula-loss.",
    health: "High nervous energy. Prone to insomnia, nervous restlessness, hyper-acidity, or respiratory sensitivities.",
    strengths: ["Highly adaptable", "Resourceful", "Witty", "Magnetic", "Multi-talented"],
    weaknesses: ["Restless", "Irresponsible", "Easily bored", "Inconsistent", "Prone to vice"],
    growthAreas: "Cultivating patience and persistent focus, completing what they start before springing towards the next adventure.",
    luckyDays: ["Wednesday", "Friday"],
    luckyColors: ["Green", "Turquoise", "Emerald"],
    luckyNumbers: [5, 1, 6],
    recommendedCareers: ["Sales Director", "Travel Blogger", "Event Planner", "Journalist", "Tech Consultant", "Crypto Trader"],
    leadershipStyle: "Agile, interactive, leading through fast-paced pivots and high communication activity.",
    communicationStyle: "Witty, intellectually stimulating, fast, utilizing modern channels with ease."
  },
  6: {
    number: 6,
    name: "The Cosmic Caregiver",
    vibe: "Venus Energy, Devotion, Nurturing, Art & Sacred Domesticity",
    personality: "Deeply nurturing, family-oriented, and artistically refined. Number 6s carry a deep sense of responsibility to protect, beautify, and teach. They love family, service, and high-aesthetic art.",
    career: "Thrives in hospitality, education, healthcare, counseling, interior design, fashion, or community organization.",
    love: "Vanguard of romantic custody. Deeply romantic, protective, and domestic. Needs a partner who honors their protective nature.",
    finance: "Consistent, comfortable abundance. Attracts wealth easily through artistic endeavors or community-driven service. Generous to a fault.",
    health: "Solid physical baseline. Needs to manage throat/neck tension, cardiac congestion, or comfort-eating tendencies.",
    strengths: ["Nurturing", "Responsible", "Artistic", "Kind-hearted", "Exceptional counselor"],
    weaknesses: ["Overprotective", "Interfering", "Martyr complex", "Self-sacrificing", "Prone to worry"],
    growthAreas: "Learning to help others without enabling dependency, and prioritizing their own self-care and artistic creation.",
    luckyDays: ["Friday", "Tuesday"],
    luckyColors: ["Pink", "Light Blue", "Pastels", "Violet"],
    luckyNumbers: [6, 5, 9],
    recommendedCareers: ["Interior Designer", "Teacher", "Counselor", "Doctor", "Hospitality Executive", "Artist/Designer"],
    leadershipStyle: "Parental, protective, creating high team morale and highly aesthetic work environments.",
    communicationStyle: "Warm, sympathetic, encouraging, heavily focused on building relational trust."
  },
  7: {
    number: 7,
    name: "The Mystical Philosopher",
    vibe: "Ketu Energy, Intuition, Solitude, Analysis & Sacred Shastras",
    personality: "Analytical, spiritual, and deeply reflective. Number 7s are truth-seekers who look beyond the veil of physical appearances. They crave silence, nature, knowledge, and deep philosophical truths.",
    career: "Excels in deep academic research, astrology, philosophy, data analysis, strategy, or high-tech programming fields.",
    love: "Private and highly selective. Needs an intellectual or spiritual partner who understands their deep requirement for silent solitude.",
    finance: "Detached attitude towards material wealth, yet naturally attracts comfort. Prefers investments in wisdom, publications, or books.",
    health: "Delicate nervous system. Thrives on clean water, deep forest walks, yoga, and meditation. Prone to skin rashes or psychosomatic reactions.",
    strengths: ["Intellectual", "Spiritual", "Highly analytical", "Intuitive", "Refined taste"],
    weaknesses: ["Aloof", "Secretive", "Skeptical", "Overthinking", "Socially detached"],
    growthAreas: "Sharing their deep inner discoveries with the world and embracing emotional expression without fear of vulnerability.",
    luckyDays: ["Monday", "Thursday", "Wednesday"],
    luckyColors: ["Pale Yellow", "Light Green", "Bronze", "White"],
    luckyNumbers: [7, 2, 9],
    recommendedCareers: ["Spiritual Researcher", "Astrologer", "Data Scientist", "Philosopher", "Strategy Consultant", "Writer/Poet"],
    leadershipStyle: "Strategic, detached, leading through deep analytical guidance and quiet wisdom.",
    communicationStyle: "Reserved, profound, highly structured, preferring meaningful written essays over speeches."
  },
  8: {
    number: 8,
    name: "The Power Innovator",
    vibe: "Saturn Energy, Karma, Authority, Wealth & Endurance",
    personality: "Pragmatic powerhouses. Number 8s are born for material success, building large networks, and weathering karmic cycles. They handle deep challenges, work relentlessly, and possess great administrative capacity.",
    career: "Fulfills destiny in politics, large-scale commerce, real estate, manufacturing, corporate management, or financial law.",
    love: "Authoritative yet deeply devoted. Demands integrity, reliability, and respect. Often acts as a solid stabilizer in family circles.",
    finance: "Capable of establishing monumental structures of wealth. Must cultivate spiritual charity to balance heavy Saturnian karmas.",
    health: "Excellent physical resilience but susceptible to chronic joint issues, rheumatic ailments, dental weaknesses, or headaches.",
    strengths: ["Business-minded", "Incredibly persistent", "Authoritative", "Just", "Organized"],
    weaknesses: ["Materialistic", "Stubborn", "Unforgiving", "Power-hungry", "Workaholic"],
    growthAreas: "Integrating deep spiritual values into material endeavors, balancing financial ambitions with cosmic charity.",
    luckyDays: ["Saturday", "Sunday"],
    luckyColors: ["Dark Blue", "Black", "Dark Green", "Purple"],
    luckyNumbers: [8, 4, 1],
    recommendedCareers: ["Investment Banker", "Corporate Executive", "Real Estate Developer", "Judge / Lawyer", "Industrialist"],
    leadershipStyle: "Commanding, rigorous, managing large scales through absolute discipline and performance standards.",
    communicationStyle: "Authoritative, practical, goal-oriented, and highly result-focused."
  },
  9: {
    number: 9,
    name: "The Universal Humanitarian",
    vibe: "Mars Energy, Compassion, Completion, Courage & Courageous Vision",
    personality: "Deeply humanitarian, creative, and courageous. Number 9 represents the end of the digit cycle-integration. They are compassionate warriors, artists, or spiritual activists determined to protect humanity.",
    career: "Succeeds in human rights protection, global NGOs, creative fields, visual arts, coaching, or medicine.",
    love: "Intense, romantic, and highly idealistic. Wants absolute honesty. Easily disappointed when partners fail to match their noble standards.",
    finance: "Attracts abundance through philanthropic actions. Believes in sharing wealth, but must watch out for emotional over-giving.",
    health: "Strong, vital constitution. Prone to high-temperature fevers, physical injuries, operations/burns, or emotional burnouts.",
    strengths: ["Altruistic", "Courageous", "Artistically gifted", "Charismatic", "Universal vision"],
    weaknesses: ["Short-tempered", "Idealistic to a fault", "Pessimistic", "Carries past resentments"],
    growthAreas: "Learning to let go of emotional attachments, forgiveness of past wounds, and accepting life's cycles gracefully.",
    luckyDays: ["Tuesday", "Thursday", "Friday"],
    luckyColors: ["Crimson Red", "Rose Pink", "Saffron"],
    luckyNumbers: [9, 3, 1],
    recommendedCareers: ["Human Rights Lawyer", "Creative Producer", "Doctor / Surgeon", "Activist", "Philosophical Coach", "Global Organizer"],
    leadershipStyle: "Altruistic, courageous, motivating teams based on broad humanitarian ideals and self-sacrifice.",
    communicationStyle: "Impassioned, dramatic, visual, addressing themes of justice, global change, and compassion."
  },
  11: {
    number: 11,
    name: "The Intuitive Luminary (Master 11)",
    vibe: "Spiritual Visionary, High Intuition, Inspiration & Cosmic Channel",
    personality: "Possesses supreme spiritual sensitivity. Represents the bridge between the spiritual and material realms. Highly intuitive, idealistic, and carries magnetic influence. Easily receives divine flashes.",
    career: "Excels in psychic consultation, healing arts, spiritual teaching, media production, global diplomacy, or poetry.",
    love: "Deeply psychic connection, romantic, and highly sensitive. Needs extreme harmony in household vibrations.",
    finance: "Dynamic. Wealth flows naturally when focusing on inspirational missions rather than raw greed. Must avoid anxious investments.",
    health: "Fragile nervous system due to constant high-vibrational input. Needs regular yoga, deep silent rest, and digital detoxing.",
    strengths: ["Highly intuitive", "Inspirational", "Charming", "Prophetic", "Empathic"],
    weaknesses: ["Hyper-nervous", "Indecisive", "Impractical", "Prone to depression", "Easily overwhelmed"],
    growthAreas: "Grounding high-frequency intuitive thoughts into practical actions instead of wallowing in anxious dreams.",
    luckyDays: ["Monday", "Sunday"],
    luckyColors: ["Silver", "White", "Pale Gold", "Violet"],
    luckyNumbers: [11, 2, 7],
    recommendedCareers: ["Spiritual Teacher", "Artist", "Psychotherapist", "Diplomat", "Visionary Leader", "Energy Healer"],
    leadershipStyle: "Charismatic and inspirational, guiding people through profound intuitive sight and cosmic modeling.",
    communicationStyle: "Poetic, metaphysical, deeply moving, invoking high ideals and transcendent goals."
  },
  22: {
    number: 22,
    name: "The Master Architect (Master 22)",
    vibe: "Monumental Builds, Earthly Manifestation, Absolute Strategy",
    personality: "The peak of material capability. Number 22 blends the intuitive sight of 11 with the step-by-step practical builders' discipline of 4. They are strategic titans who build massive international structures or systems that change society.",
    career: "Excels in global construction, industrial organization, monumental finance, municipal strategy, or structural engineering.",
    love: "Incredibly supportive, reliable, and builds legacy relationships. Wants a partner to help build their giant empire.",
    finance: "Supreme material potential. Able to manage multi-million budgets with ease, creating lasting financial assets.",
    health: "Stout physical capacity but can break under extreme pressure. Vulnerable to structural/skeletal stresses or physical collapse.",
    strengths: ["Strategic titan", "Highly visionary", "Extremely practical", "Disciplined", "Legacy builder"],
    weaknesses: ["Overbearing", "Rigid", "Terrified of failure", "Materialistic pressure", "Controlling"],
    growthAreas: "Integrating massive ambitions with the health of their soul and sharing control to avoid physical burnouts.",
    luckyDays: ["Saturday", "Wednesday"],
    luckyColors: ["Grey", "Gold", "Royal Blue", "Terracotta"],
    luckyNumbers: [22, 4, 8],
    recommendedCareers: ["Legacy Builder / Owner", "City Planner", "Corporate Strategist", "Industrial Magnate", "International Architect"],
    leadershipStyle: "Strategic, monumental, organizing huge hierarchies with flawless precision and long-term security.",
    communicationStyle: "Pragmatic, sweeping, strategic, laying down absolute blueprints with total certainty."
  },
  33: {
    number: 33,
    name: "The Master Teacher (Master 33)",
    vibe: "Universal Devotion, Direct Spiritual Awakening, Infinite Love",
    personality: "The number of selfless spiritual service. Blends full active communication (3) with cosmic Venusian caregiving (6). They are avatars of pure love, compassionate healing, and deep service, taking on the suffering of those around them.",
    career: "Excels in humanitarian stewardship, spiritual mentorship, large counseling guilds, or advanced child education.",
    love: "Infinite emotional capacity, healing, and absolute selflessness. Easily gives more than they take.",
    finance: "Comfortable abundance. Money is viewed strictly as a resource tool to help heal suffering. Attracts wealth effortlessly.",
    health: "Naturally robust but absorbs clean/unclean environmental energy. Prone to throat/circulatory blocks or chest strain due to deep compassion.",
    strengths: ["Altruistic", "Profoundly loving", "Inspiring healer", "Artistic genius", "Universal guide"],
    weaknesses: ["Martyr complex", "Overwhelmed by pain", "Self-neglecting", "Easily drained by leeches"],
    growthAreas: "Learning that protecting their own light and health is essential to keep healing others.",
    luckyDays: ["Thursday", "Friday"],
    luckyColors: ["Saffron", "Rose Pink", "Violet", "Deep Yellow"],
    luckyNumbers: [33, 6, 3],
    recommendedCareers: ["Spiritual Avatar", "Humanitarian Director", "Elite Counselor", "Vedic Scholar", "Master Educator", "Global Advocate"],
    leadershipStyle: "Compassionate, avatar-spirited, transforming organizations through pure moral authority and infinite care.",
    communicationStyle: "Enchanting, spiritually deep, exceptionally magnetic, communicating through absolute love and truth."
  }
};

// ==========================================
// CALCULATION LOGICAL UTILITIES
// ==========================================

export const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

export interface CalculationResult {
  value: number;
  trail: string;
}

export function isMaster(num: number): boolean {
  return num === 11 || num === 22 || num === 33;
}

export function reduceToSingleOrMaster(num: number): CalculationResult {
  if (isMaster(num)) {
    return { value: num, trail: `${num} (Master Number)` };
  }
  if (num < 10) {
    return { value: num, trail: `${num}` };
  }
  
  let current = num;
  const trailParts = [current.toString()];
  
  while (current > 9 && !isMaster(current)) {
    const digits = current.toString().split('');
    const sum = digits.reduce((acc, char) => acc + parseInt(char, 10), 0);
    trailParts.push(`${digits.join(' + ')} = ${sum}`);
    current = sum;
  }
  
  if (isMaster(current)) {
    trailParts[trailParts.length - 1] += ` (Master Number)`;
  }
  
  return { value: current, trail: trailParts.join(' -> ') };
}

export function parseDOB(dateStr: string): { day: number; month: number; year: number } {
  const parts = dateStr.split(/[-/._]/);
  if (parts.length >= 3) {
    if (parts[0].length === 4) {
      return { year: parseInt(parts[0], 10), month: parseInt(parts[1], 10), day: parseInt(parts[2], 10) };
    } else {
      return { day: parseInt(parts[0], 10), month: parseInt(parts[1], 10), year: parseInt(parts[2], 10) };
    }
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
  }
  return { day: 1, month: 1, year: 2000 };
}

export function calculateLifePathNumber(dateStr: string): CalculationResult {
  const { day, month, year } = parseDOB(dateStr);
  
  const dResult = reduceToSingleOrMaster(day);
  const mResult = reduceToSingleOrMaster(month);
  const yResult = reduceToSingleOrMaster(year);
  
  const total = dResult.value + mResult.value + yResult.value;
  const finalResult = reduceToSingleOrMaster(total);
  
  const trail = `Day (${day}): ${dResult.trail}\nMonth (${month}): ${mResult.trail}\nYear (${year}): ${yResult.trail}\nSum: ${dResult.value} + ${mResult.value} + ${yResult.value} = ${total}\nFinal: ${finalResult.trail}`;
  
  return { value: finalResult.value, trail };
}

export function calculateBirthNumber(dateStr: string): CalculationResult {
  const { day } = parseDOB(dateStr);
  return reduceToSingleOrMaster(day);
}

export function calculateBirthdayNumber(dateStr: string): CalculationResult {
  const { day } = parseDOB(dateStr);
  return { value: day, trail: `${day} (Retained as meaningful 1-31)` };
}

export function getWordValues(name: string, map: Record<string, number>, filter?: 'vowels' | 'consonants'): { sum: number, trail: string } {
  const words = name.toUpperCase().split(/\s+/);
  const wordSums = [];
  const standardVowels = ['A', 'E', 'I', 'O', 'U'];
  let totalSum = 0;
  
  for (const word of words) {
    const cleanWord = word.replace(/[^A-Z]/g, '');
    if (!cleanWord) continue;
    
    let wordSum = 0;
    const hasStandardVowel = cleanWord.split('').some(char => standardVowels.includes(char));
    const vowels = hasStandardVowel ? standardVowels : [...standardVowels, 'Y'];
    const chars = [];
    
    for (let i = 0; i < cleanWord.length; i++) {
      const char = cleanWord[i];
      const isVowel = vowels.includes(char);
      const includeChar = filter === 'vowels' ? isVowel : (filter === 'consonants' ? !isVowel : true);
      
      if (includeChar && map[char] !== undefined) {
        wordSum += map[char];
        chars.push(`${char}(${map[char]})`);
      }
    }
    
    totalSum += wordSum;
    if (chars.length > 0) {
      wordSums.push(`[${chars.join(' + ')} = ${wordSum}]`);
    } else {
      wordSums.push(`[0]`);
    }
  }
  
  const wordsTrail = wordSums.join(' + ');
  return { sum: totalSum, trail: `${wordsTrail} = ${totalSum}` };
}

export function calculateDestinyNumber(name: string, system: 'chaldean' | 'pythagorean' = 'chaldean'): CalculationResult {
  const map = system === 'chaldean' ? CHALDEAN_MAP : PYTHAGOREAN_MAP;
  const { sum, trail } = getWordValues(name, map);
  const result = reduceToSingleOrMaster(sum);
  return { value: result.value, trail: `${trail}\nReduction: ${result.trail}` };
}

export function calculateSoulUrgeNumber(name: string, system: 'chaldean' | 'pythagorean' = 'chaldean'): CalculationResult {
  const map = system === 'chaldean' ? CHALDEAN_MAP : PYTHAGOREAN_MAP;
  const { sum, trail } = getWordValues(name, map, 'vowels');
  const result = reduceToSingleOrMaster(sum);
  return { value: result.value, trail: `${trail}\nReduction: ${result.trail}` };
}

export function calculatePersonalityNumber(name: string, system: 'chaldean' | 'pythagorean' = 'chaldean'): CalculationResult {
  const map = system === 'chaldean' ? CHALDEAN_MAP : PYTHAGOREAN_MAP;
  const { sum, trail } = getWordValues(name, map, 'consonants');
  const result = reduceToSingleOrMaster(sum);
  return { value: result.value, trail: `${trail}\nReduction: ${result.trail}` };
}

export function calculateExpressionNumber(name: string, system: 'chaldean' | 'pythagorean' = 'chaldean'): CalculationResult {
  return calculateDestinyNumber(name, system);
}

export function calculateMaturityNumber(lifePath: number, destiny: number): CalculationResult {
  const sum = lifePath + destiny;
  const result = reduceToSingleOrMaster(sum);
  return { value: result.value, trail: `Life Path (${lifePath}) + Destiny (${destiny}) = ${sum}\nReduction: ${result.trail}` };
}

export function calculateBalanceNumber(name: string, system: 'chaldean' | 'pythagorean' = 'chaldean'): CalculationResult {
  const words = name.toUpperCase().split(/\s+/).map(w => w.replace(/[^A-Z]/g, '')).filter(w => w.length > 0);
  const map = system === 'chaldean' ? CHALDEAN_MAP : PYTHAGOREAN_MAP;
  let sum = 0;
  const trailParts = [];
  
  for (const word of words) {
    const init = word[0];
    if (init && map[init]) {
      sum += map[init];
      trailParts.push(`${init}(${map[init]})`);
    }
  }
  
  if (sum === 0) return { value: 0, trail: "0" };
  const result = reduceToSingleOrMaster(sum);
  return { value: result.value, trail: `Initials: ${trailParts.join(' + ')} = ${sum}\nReduction: ${result.trail}` };
}

export function calculatePersonalYear(dob: string, currentDate: string): CalculationResult {
  const birth = parseDOB(dob);
  const current = parseDOB(currentDate);
  
  const dResult = reduceToSingleOrMaster(birth.day);
  const mResult = reduceToSingleOrMaster(birth.month);
  const yResult = reduceToSingleOrMaster(current.year);
  
  const total = dResult.value + mResult.value + yResult.value;
  const finalResult = reduceToSingleOrMaster(total);
  
  const trail = `Birth Day (${birth.day}): ${dResult.trail}\nBirth Month (${birth.month}): ${mResult.trail}\nCurrent Year (${current.year}): ${yResult.trail}\nSum: ${dResult.value} + ${mResult.value} + ${yResult.value} = ${total}\nFinal: ${finalResult.trail}`;
  
  return { value: finalResult.value, trail };
}

export function calculatePersonalMonth(personalYear: number, currentDate: string): CalculationResult {
  const current = parseDOB(currentDate);
  const mResult = reduceToSingleOrMaster(current.month);
  const total = personalYear + mResult.value;
  const result = reduceToSingleOrMaster(total);
  
  return { value: result.value, trail: `Personal Year (${personalYear}) + Current Month (${current.month} -> ${mResult.value}) = ${total}\nReduction: ${result.trail}` };
}

export function calculatePersonalDay(personalMonth: number, currentDate: string): CalculationResult {
  const current = parseDOB(currentDate);
  const dResult = reduceToSingleOrMaster(current.day);
  const total = personalMonth + dResult.value;
  const result = reduceToSingleOrMaster(total);
  
  return { value: result.value, trail: `Personal Month (${personalMonth}) + Current Day (${current.day} -> ${dResult.value}) = ${total}\nReduction: ${result.trail}` };
}

export function calculatePinnacles(dob: string): { 
  first: CalculationResult, second: CalculationResult, third: CalculationResult, fourth: CalculationResult,
  firstAge: number, secondAge: number, thirdAge: number
} {
  const birth = parseDOB(dob);
  const dResult = reduceToSingleOrMaster(birth.day);
  const mResult = reduceToSingleOrMaster(birth.month);
  const yResult = reduceToSingleOrMaster(birth.year);
  
  const firstSum = mResult.value + dResult.value;
  const first = reduceToSingleOrMaster(firstSum);
  first.trail = `Month (${mResult.value}) + Day (${dResult.value}) = ${firstSum}\nReduction: ${first.trail}`;
  
  const secondSum = dResult.value + yResult.value;
  const second = reduceToSingleOrMaster(secondSum);
  second.trail = `Day (${dResult.value}) + Year (${yResult.value}) = ${secondSum}\nReduction: ${second.trail}`;
  
  const thirdSum = first.value + second.value;
  const third = reduceToSingleOrMaster(thirdSum);
  third.trail = `1st Pinnacle (${first.value}) + 2nd Pinnacle (${second.value}) = ${thirdSum}\nReduction: ${third.trail}`;
  
  const fourthSum = mResult.value + yResult.value;
  const fourth = reduceToSingleOrMaster(fourthSum);
  fourth.trail = `Month (${mResult.value}) + Year (${yResult.value}) = ${fourthSum}\nReduction: ${fourth.trail}`;
  
  let singleLifePath = calculateLifePathNumber(dob).value;
  while(singleLifePath > 9 && singleLifePath !== 11 && singleLifePath !== 22 && singleLifePath !== 33) {
    singleLifePath = singleLifePath.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  }
  // Standard numerology age formula uses the fully reduced life path (1-9)
  const reducedLp = (singleLifePath === 11) ? 2 : (singleLifePath === 22) ? 4 : (singleLifePath === 33) ? 6 : singleLifePath;
  
  const firstAge = 36 - reducedLp;
  const secondAge = firstAge + 9;
  const thirdAge = secondAge + 9;
  
  return { first, second, third, fourth, firstAge, secondAge, thirdAge };
}

// Advanced Compatibility Analysis
// Advanced Compatibility Analysis
export function checkNumerologyCompatibility(n1: number, n2: number): {
  score: number;
  grade: 'EXCELLENT' | 'COMPATIBLE' | 'CHALLENGING' | 'NEUTRAL';
  description: string;
} {
  // Simplify 11, 22, 33 to root digits for basic astrological/shastra compatibility
  const r1 = n1 === 11 ? 2 : n1 === 22 ? 4 : n1 === 33 ? 6 : n1;
  const r2 = n2 === 11 ? 2 : n2 === 22 ? 4 : n2 === 33 ? 6 : n2;

  // Let's build a clean compatibility grid matrix mapping 1-9
  // Friendly: 
  // 1 is friendly with 1, 3, 5, 9
  // 2 is friendly with 2, 7, 9
  // 3 is friendly with 1, 3, 5, 9
  // 4 is friendly with 1, 5, 6, 8
  // 5 is friendly with 1, 3, 5, 6
  // 6 is friendly with 5, 6, 8
  // 7 is friendly with 2, 7, 9
  // 8 is friendly with 4, 6, 8
  // 9 is friendly with 1, 2, 3, 9
  
  const friendships: Record<number, number[]> = {
    1: [1, 3, 5, 9],
    2: [2, 7, 9, 3],
    3: [1, 3, 5, 9],
    4: [5, 6, 8, 1],
    5: [1, 3, 5, 6],
    6: [5, 6, 8, 4],
    7: [2, 7, 9],
    8: [4, 6, 8],
    9: [1, 2, 3, 9]
  };

  const enemies: Record<number, number[]> = {
    1: [8, 6],
    2: [5, 8],
    3: [6],
    4: [9, 2],
    5: [2, 7],
    6: [1, 3],
    7: [1, 8],
    8: [1, 2, 9],
    9: [4, 8]
  };

  if (r1 === r2) {
    return {
      score: 92,
      grade: "EXCELLENT",
      description: "Harmonious resonance! Two matching frequencies signify strong mutual understanding, shared vision, and smooth daily cooperation."
    };
  }

  const isFriendly = (friendships[r1]?.includes(r2)) || (friendships[r2]?.includes(r1));
  const isHostile = (enemies[r1]?.includes(r2)) || (enemies[r2]?.includes(r1));

  if (isFriendly) {
    return {
      score: 85,
      grade: "COMPATIBLE",
      description: "Highly cooperative combination. These planetary energies support and expand upon each other, creating balanced growth and a sturdy relational foundation."
    };
  } else if (isHostile) {
    return {
      score: 55,
      grade: "CHALLENGING",
      description: "Vibrations present minor friction. Requires active compromises and respecting boundaries. This relationship serves as a learning space for personal karma."
    };
  } else {
    return {
      score: 72,
      grade: "NEUTRAL",
      description: "Stable and neutral dynamics. While not sparking instantaneous affinity, it presents a very peaceful baseline where progress depends on conscious effort."
    };
  }
}

// Business and Brand Name Suitability
export function assessBusinessName(name: string): {
  number: number;
  suitability: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'AVOID';
  vibes: string;
  advice: string;
} {
  const num = calculateDestinyNumber(name, 'chaldean').value;
  
  // Best digits for business in Chaldean systems are usually 1 (Sun - authority, leadership), 3 (Jupiter - wealth, growth), 5 (Mercury - transactions, trade), 6 (Venus - luxury, aesthetics, food)
  if ([1, 3, 5, 6, 33].includes(num)) {
    return {
      number: num,
      suitability: "EXCELLENT",
      vibes: "Prosperity, Expansion, Rapid Transactions, Divine Grace",
      advice: `The numerological calculation resolves to ${num}. This is a highly auspicious vibration for corporate commerce, brands, client-relations and scaling markets.`
    };
  } else if ([9, 22].includes(num)) {
    return {
      number: num,
      suitability: "GOOD",
      vibes: "Global Legacy, Philanthropic Impact, Authority",
      advice: `Resolves to ${num}. Excellent for educational academies, hospitals, real-estate, or corporate empires built for societal legacy.`
    };
  } else if ([2, 7, 11].includes(num)) {
    return {
      number: num,
      suitability: "MODERATE",
      vibes: "Intuitive Resonance, Advisory, Artistic Selectivity",
      advice: `Resolves to ${num}. Best suited for boutique salons, counseling, astrology centers, or psychological research. Less recommended for fast retail.`
    };
  } else {
    // 4, 8
    return {
      number: num,
      suitability: "MODERATE",
      vibes: "Karmic Labors, Strict Discipline, Slow Progress",
      advice: `Resolves to ${num}. Suggests persistent hurdles or delayed returns unless your business handles raw materials, heavy machinery, or mining.`
    };
  }
}

// Mobile Number Vibe Analysis
export function analyzeMobileNumber(phoneStr: string): {
  totalSum: number;
  reduced: number;
  vibe: string;
  suitability: string;
} {
  const digits = phoneStr.replace(/[^0-9]/g, '');
  if (!digits) {
    return { totalSum: 0, reduced: 0, vibe: "No data", suitability: "N/A" };
  }
  const totalSum = digits.split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  const reduced = reduceToSingleOrMaster(totalSum).value;

  const keyVibes: Record<number, { vibe: string; suit: string }> = {
    1: { vibe: "Commanding, active, entrepreneurial, highly personal.", suit: "Best for top executives, company directors, founders." },
    2: { vibe: "Diplomatic, peaceful, patient, relationship builder.", suit: "Excellent for negotiators, counselors, customer support." },
    3: { vibe: "Highly artistic, educational, public-friendly, expansive.", suit: "Best for content creators, researchers, novelists, teachers." },
    4: { vibe: "Highly structured, detailed, process oriented.", suit: "Good for administrators, security personnel, developers." },
    5: { vibe: "Ultra-fast communication, trading, travel-loving.", suit: "Ideal for sales executives, stock traders, journalists." },
    6: { vibe: "Nurturing, family-centric, luxurious, comfort oriented.", suit: "Perfect for hotel lines, wellness hubs, family focal points." },
    7: { vibe: "Highly introspective, strategic, private, spiritual.", suit: "Best for yoga gurus, researchers, backend developers." },
    8: { vibe: "Extremely serious, material management, administrative power.", suit: "Great for corporate banking, law, complex industrial operations." },
    9: { vibe: "Humanitarian assistance, courageous, public defense.", suit: "Outstanding for social work, defense personnel, surgeons." },
    11: { vibe: "Charged with luminous intuitive light, catalytic inspiration.", suit: "Exceptional for spiritual healers, channelers, writers." },
    22: { vibe: "Monumental strategy, international network builder.", suit: "Optimal for massive business deals, corporate tycoons." },
    33: { vibe: "Universal moral caretaker, infinite spiritual love.", suit: "Ideal for deep-hearted teachers and divine service providers." }
  };

  const info = keyVibes[reduced] || { vibe: "Balanced energetic vibration.", suit: "Universal support." };
  return {
    totalSum,
    reduced,
    vibe: info.vibe,
    suitability: info.suit
  };
}

// Vehicle Number Analysis
export function analyzeVehicleNumber(plateStr: string): {
  totalSum: number;
  reduced: number;
  vibe: string;
  energy: 'HIGHLY HARMONIOUS' | 'STABLE' | 'requires_attention';
  remedy: string;
} {
  // Sum both numeric digits and alphabet characters in registration plate
  // Standard plate e.g. "DL 3C AB 1234"
  const cleanPlate = plateStr.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let totalSum = 0;
  for (let i = 0; i < cleanPlate.length; i++) {
    const char = cleanPlate[i];
    if (/[0-9]/.test(char)) {
      totalSum += parseInt(char, 10);
    } else if (/[A-Z]/.test(char)) {
      if (CHALDEAN_MAP[char] !== undefined) {
        totalSum += CHALDEAN_MAP[char];
      }
    }
  }

  const reduced = reduceToSingleOrMaster(totalSum).value;

  const vehicleVibes: Record<number, { vibe: string; energy: 'HIGHLY HARMONIOUS' | 'STABLE' | 'requires_attention'; remedy: string }> = {
    1: { vibe: "Leader vehicle, speedy, attention-grabbing. Thrives on highways.", energy: "HIGHLY HARMONIOUS", remedy: "Keep dashboard spotlessly clean, place a small solar/bronze coin symbol." },
    2: { vibe: "Quiet, comfortable drive, sensitive brakes. Prefers relaxed travel.", energy: "STABLE", remedy: "Place a small silver coin or white marble piece inside." },
    3: { vibe: "Intellectually fortunate, educational aura, very lucky for family trips.", energy: "HIGHLY HARMONIOUS", remedy: "Tie a small saffron thread in the cabin." },
    4: { vibe: "Prone to strange mechanical/electrical anomalies. Very stubborn tires.", energy: "requires_attention", remedy: "Ensure regular prompt maintenance; avoid rash high-speed turns." },
    5: { vibe: "Fast accelerator, highly flexible wheeling, extremely communicative navigation.", energy: "HIGHLY HARMONIOUS", remedy: "Keep some green cardamoms inside the storage compartment." },
    6: { vibe: "Highly decorative luxury interior, smooth shock absorbers, very stylish.", energy: "HIGHLY HARMONIOUS", remedy: "Spritz high-quality sandalwood or rose fragrance in the cabin." },
    7: { vibe: "Mysterious GPS signals, very silent engine, loves remote natural trials.", energy: "STABLE", remedy: "Place a small raw quartz crystal inside." },
    8: { vibe: "Extremely heavy build, tireless carrier. Requires disciplined servicing.", energy: "requires_attention", remedy: "Never let iron clutter build up in the trunk. Avoid parking in mud." },
    9: { vibe: "Fiery engine power, strong headlights, highly prompt reaction.", energy: "HIGHLY HARMONIOUS", remedy: "Place a clean brass artifact or small red cloth in the glove compartment." },
    11: { vibe: "Highly inspirational pathways, protective shield.", energy: "HIGHLY HARMONIOUS", remedy: "Maintain peaceful chants on the audio system." },
    22: { vibe: "Supreme strategic journeys, robust chassis, outstanding safety records.", energy: "HIGHLY HARMONIOUS", remedy: "Always verify fluid levels on Saturday." },
    33: { vibe: "Sacred chariot energy, beautiful spiritual service flow.", energy: "HIGHLY HARMONIOUS", remedy: "Place a picture of traditional lineage Gurus." }
  };

  const defaultVibe = { vibe: "Steady journeys and balanced travel.", energy: "STABLE" as const, remedy: "Always drive carefully and respect road safety rules." };
  return {
    totalSum,
    reduced,
    ...(vehicleVibes[reduced] || defaultVibe)
  };
}

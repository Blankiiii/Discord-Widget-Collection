const { 
  API_KEY,        // R6Data API key
  Player_Name,    // R6 username
  Platform_Type,  // Platform type: uplay, xbl, or psn
  Platform_Family // Platform family: pc or console
} = require('./config.json');
const iconsConfig = require('./icons.config.json');

const VALID_PLATFORM_TYPES = ['uplay', 'xbl', 'psn'];
const VALID_PLATFORM_FAMILIES = ['pc', 'console'];
const RUN_ONCE = process.argv.includes('--once');

function validateConfig() {
  if (!API_KEY || typeof API_KEY !== 'string') {
    throw new Error('config.json must include a valid API_KEY');
  }
  if (!Player_Name || typeof Player_Name !== 'string') {
    throw new Error('config.json must include a valid Player_Name');
  }
  if (!VALID_PLATFORM_TYPES.includes(String(Platform_Type).toLowerCase())) {
    throw new Error(`Platform_Type must be one of: ${VALID_PLATFORM_TYPES.join(', ')}`);
  }
  if (!VALID_PLATFORM_FAMILIES.includes(String(Platform_Family).toLowerCase())) {
    throw new Error(`Platform_Family must be one of: ${VALID_PLATFORM_FAMILIES.join(', ')}`);
  }
}

validateConfig();

function normalizeKey(key) {
  return String(key)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function searchObject(data, matchFn) {
  if (data === null || data === undefined) return undefined;
  if (typeof data !== 'object') return undefined;

  if (Array.isArray(data)) {
    for (const item of data) {
      const found = searchObject(item, matchFn);
      if (found !== undefined) return found;
    }
    return undefined;
  }

  if (matchFn(data) === true) return data;

  for (const key of Object.keys(data)) {
    const found = searchObject(data[key], matchFn);
    if (found !== undefined) return found;
  }

  return undefined;
}

function findValue(data, keys) {
  if (!data || typeof data !== 'object') return undefined;

  const candidates = keys.map(normalizeKey);
  for (const key of Object.keys(data)) {
    const normalized = normalizeKey(key);
    if (candidates.includes(normalized)) return data[key];
  }

  for (const key of Object.keys(data)) {
    const value = data[key];
    if (typeof value === 'object') {
      const found = findValue(value, keys);
      if (found !== undefined) return found;
    }
  }

  return undefined;
}

function toPercent(value) {
  if (value == null || Number.isNaN(Number(value))) return '0%';
  return `${Math.round(Number(value))}%`;
}

function toFixedNumber(value, digits = 2) {
  if (value == null || Number.isNaN(Number(value))) return '0';
  return Number(value).toFixed(digits);
}

const RANK_NAMES = [
  'Unranked',
  'Copper V',
  'Copper IV',
  'Copper III',
  'Copper II',
  'Copper I',
  'Bronze V',
  'Bronze IV',
  'Bronze III',
  'Bronze II',
  'Bronze I',
  'Silver V',
  'Silver IV',
  'Silver III',
  'Silver II',
  'Silver I',
  'Gold V',
  'Gold IV',
  'Gold III',
  'Gold II',
  'Gold I',
  'Platinum V',
  'Platinum IV',
  'Platinum III',
  'Platinum II',
  'Platinum I',
  'Emerald V',
  'Emerald IV',
  'Emerald III',
  'Emerald II',
  'Emerald I',
  'Diamond V',
  'Diamond IV',
  'Diamond III',
  'Diamond II',
  'Diamond I',
  'Champion'
];

function formatRank(rankValue) {
  if (rankValue == null) return 'Unknown';
  if (typeof rankValue === 'string' && /^[0-9]+$/.test(rankValue.trim())) {
    rankValue = Number(rankValue.trim());
  }
  if (typeof rankValue === 'number' && Number.isInteger(rankValue)) {
    if (rankValue >= 0 && rankValue < RANK_NAMES.length) {
      return RANK_NAMES[rankValue];
    }
  }
  return String(rankValue);
}

function getRankImageUrl(rankName) {
  if (!rankName || typeof rankName !== 'string') return undefined;

  const normalized = rankName
    .trim()
    .split(/\s+/)
    .map((word, index, parts) => {
      if (index === parts.length - 1 && /^[ivx]+$/i.test(word)) {
        return word.toUpperCase();
      }
      return word.toLowerCase();
    })
    .join('');

  return iconsConfig[normalized];
}

function getOperatorImageUrl(operatorName) {
  if (!operatorName || typeof operatorName !== 'string') return '<URL to most_Played_Attack_img.png>';
  const operatorMap = {
    'capitão': 'capitao',
    'capitao': 'capitao',
    'nøkk': 'nokk',
    'nokk': 'nokk',
    'jäger': 'jager',
    'jager': 'jager',
    'skopós': 'skopos',
    'skopos': 'skopos',
    'tubarão': 'tubarao',
    'tubarao': 'tubarao',
  };

  let slug = operatorName
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[øØ]/g, 'o')
    .replace(/[æÆ]/g, 'ae')
    .replace(/[åÅ]/g, 'a')
    .replace(/[çÇ]/g, 'c')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .replace(/^-+|-+$/g, '');

  if (operatorMap[slug]) {
    slug = operatorMap[slug];
  }

  return `https://r6data.com/assets/img/operators/${slug}.png`;
}

function mapPlatform(platformType) {
  const key = String(platformType || '').toLowerCase();
  if (key.includes('uplay') || key === 'pc') return 'PC';
  if (key.includes('xbox') || key.includes('xbl')) return 'XBOX';
  if (key.includes('psn') || key.includes('playstation')) return 'PSN';
  return String(platformType || '').toUpperCase();
}

function findMostPlayedValue(profile, keys) {
  const raw = findValue(profile, keys);
  if (raw == null) return '';
  if (typeof raw === 'number') return toPercent(raw);
  if (typeof raw === 'string' && raw.trim() !== '') {
    if (/^[0-9.]+$/.test(raw.trim())) {
      return toPercent(Number(raw.trim()));
    }
    return raw;
  }
  return '';
}

function findBestOperatorName(operators, side) {
  if (!Array.isArray(operators)) return '';
  const list = operators.filter((op) => String(op.side || '').toLowerCase() === String(side || '').toLowerCase());
  if (!list.length) return '';
  list.sort((a, b) => {
    const aTime = Number(a.timePlayedMs) || 0;
    const bTime = Number(b.timePlayedMs) || 0;
    if (aTime !== bTime) return bTime - aTime;
    return (Number(b.matchesPlayed) || 0) - (Number(a.matchesPlayed) || 0);
  });
  return String(list[0].operator || '').trim();
}

function buildOutput(profile, operators) {
  const wins = Number(findValue(profile, ['wins', 'win'])) || 0;
  const losses = Number(findValue(profile, ['losses', 'loss'])) || 0;
  const kills = Number(findValue(profile, ['kills', 'kill'])) || 0;
  const deaths = Number(findValue(profile, ['deaths', 'death'])) || 0;

  const currentRank =
    findValue(profile, ['current_rank_name', 'rank_name', 'rank', 'current_rank', 'rankName']) ||
    findValue(profile, ['mmr_rank_name', 'max_rank_name', 'max_rank']);
  const maxRank =
    findValue(profile, ['max_rank_name', 'peak_rank_name', 'max_rank', 'peak_rank']) ||
    currentRank;

  const formattedCurrentRank = formatRank(currentRank);
  const formattedMaxRank = formatRank(maxRank);

  const totalGames = wins + losses;
  const wr = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  const kd = deaths > 0 ? kills / deaths : 0;

  const mostPlayedAttack = findBestOperatorName(operators, 'Attacker');
  const mostPlayedDefense = findBestOperatorName(operators, 'Defender');

  const attackImageUrl = mostPlayedAttack
    ? getOperatorImageUrl(mostPlayedAttack)
    : '<URL to most_Played_Attack_img.png>';
  const defenseImageUrl = mostPlayedDefense
    ? getOperatorImageUrl(mostPlayedDefense)
    : '<URL to most_Played_Defense_img.png>';

  const dynamic = [
    { type: 1, name: 'user_Name', value: Player_Name },
    { type: 1, name: 'user_Platform', value: mapPlatform(Platform_Type) },
    { type: 1, name: 'current_Rank', value: formattedCurrentRank }
  ];

  const currentRankUrl = getRankImageUrl(formattedCurrentRank);
  if (currentRankUrl) {
    dynamic.push({ type: 3, name: 'current_Rank_img', value: { url: currentRankUrl } });
  }

  dynamic.push({ type: 1, name: 'max_Rank', value: formattedMaxRank });
  const maxRankUrl = getRankImageUrl(formattedMaxRank);
  if (maxRankUrl) {
    dynamic.push({ type: 3, name: 'max_Rank_img', value: { url: maxRankUrl } });
  }

  dynamic.push(
    { type: 1, name: 'current_WR', value: `${wr}%` },
    { type: 1, name: 'current_KD', value: toFixedNumber(kd, 2) },
    { type: 1, name: 'most_Played_Attack', value: mostPlayedAttack },
    { type: 3, name: 'most_Played_Attack_img', value: { url: attackImageUrl } },
    { type: 1, name: 'most_Played_Defense', value: mostPlayedDefense },
    { type: 3, name: 'most_Played_Defense_img', value: { url: defenseImageUrl } }
  );

  return {
    data: {
      dynamic
    }
  };
}

async function fetchRawR6Json() {
  const statsUrl = new URL('https://api.r6data.com/api/stats');
  statsUrl.searchParams.set('type', 'stats');
  statsUrl.searchParams.set('nameOnPlatform', Player_Name);
  statsUrl.searchParams.set('platformType', Platform_Type);
  statsUrl.searchParams.set('platform_families', Platform_Family);
  statsUrl.searchParams.set('board_id', 'ranked');

  const operatorStatsUrl = new URL('https://api.r6data.com/api/stats');
  operatorStatsUrl.searchParams.set('type', 'operatorStats');
  operatorStatsUrl.searchParams.set('nameOnPlatform', Player_Name);
  operatorStatsUrl.searchParams.set('platformType', Platform_Type);
  operatorStatsUrl.searchParams.set('platform_families', Platform_Family);

  const [statsResp, opsResp] = await Promise.all([
    fetch(statsUrl.toString(), {
      method: 'GET',
      headers: {
        'api-key': API_KEY,
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'User-Agent': 'r6data-raw-fetch/1.0'
      }
    }),
    fetch(operatorStatsUrl.toString(), {
      method: 'GET',
      headers: {
        'api-key': API_KEY,
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'User-Agent': 'r6data-raw-fetch/1.0'
      }
    })
  ]);

  if (!statsResp.ok) {
    const text = await statsResp.text();
    console.error('R6Data stats API error', statsResp.status, statsResp.statusText);
    console.error(text);
    process.exit(1);
  }

  if (!opsResp.ok) {
    const text = await opsResp.text();
    console.error('R6Data operatorStats API error', opsResp.status, opsResp.statusText);
    console.error(text);
    process.exit(1);
  }

  const statsData = await statsResp.json();
  const operatorData = await opsResp.json();
  const operators = Array.isArray(operatorData.operators) ? operatorData.operators : [];

  const rankedProfile =
    searchObject(statsData, (item) =>
      item && typeof item === 'object' && item.board_id === 'ranked' && Array.isArray(item.full_profiles)
    ) ||
    searchObject(statsData, (item) =>
      item && typeof item === 'object' && Array.isArray(item.full_profiles) && item.full_profiles.some((p) => p && p.profile)
    );

  const profile = rankedProfile?.full_profiles?.[0]?.profile || rankedProfile?.profile || statsData;
  const output = buildOutput(profile, operators);
  console.log(JSON.stringify(output));
}

async function runOnce() {
  try {
    await fetchRawR6Json();
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

if (RUN_ONCE) {
  runOnce();
} else {
  const intervalMs = 10 * 60 * 1000;
  const intervalId = setInterval(runOnce, intervalMs);

  process.on('SIGINT', () => {
    console.log('Stopping on Ctrl+C...');
    clearInterval(intervalId);
    process.exit(0);
  });

  runOnce();
}
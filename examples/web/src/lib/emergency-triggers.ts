/**
 * Emergency trigger word detection for the Emergency First Resolver.
 *
 * Words are deliberately broad to catch variations. False positives are
 * acceptable (the banner is dismissible); false negatives in a crisis are not.
 *
 * Design principles:
 *  - Case-insensitive matching (caller normalises to lower-case)
 *  - Word-boundary awareness handled by caller via regex
 *  - No PII stored — words are checked and then discarded
 */

/** Trigger terms in English (includes common search patterns) */
const ENGLISH_TRIGGERS: readonly string[] = [
  'suicide',
  'suicidal',
  'kill myself',
  'killing myself',
  'end my life',
  'ending my life',
  'want to die',
  'wanting to die',
  "don't want to live",
  'no reason to live',
  'not worth living',
  'life is not worth',
  'take my own life',
  'taking my own life',
  'help me die',
  "can't go on",
  'cannot go on',
  'give up on life',
  'overdose on purpose',
  'self harm',
  'self-harm',
  'selfharm',
  'cutting myself',
  'hurt myself',
  'hurting myself',
  'die tonight',
  'die today',
  'crisis hotline',
  'hotline for suicide',
];

/** Trigger terms in Japanese */
const JAPANESE_TRIGGERS: readonly string[] = [
  '自殺',
  '自死',
  '死にたい',
  '死にたくなった',
  '消えたい',
  '生きたくない',
  'もう生きたくない',
  '生きるのがつらい',
  '死ぬ方法',
  '首を吊る',
  '飛び降り',
  '自傷',
  'リストカット',
  'オーバードーズ',
  '過剰服薬',
  '消えてしまいたい',
  '死ぬつもり',
  '自殺方法',
  '死ぬ準備',
  'いのちの電話',
  '自殺ホットライン',
];

/** Trigger terms in Spanish */
const SPANISH_TRIGGERS: readonly string[] = [
  'suicidio',
  'suicida',
  'suicidarme',
  'matarme',
  'quiero morir',
  'quiero morirme',
  'quiero la muerte',
  'no quiero vivir',
  'sin ganas de vivir',
  'acabar con mi vida',
  'terminar con mi vida',
  'hacerme daño',
  'autolesión',
  'autolesionarme',
  'cortarme',
  'línea de crisis',
  'ayuda suicidio',
  'no puedo más',
  'quitarme la vida',
  'dejar de existir',
];

/** All triggers across all supported languages */
const ALL_TRIGGERS: readonly string[] = [
  ...ENGLISH_TRIGGERS,
  ...JAPANESE_TRIGGERS,
  ...SPANISH_TRIGGERS,
];

/**
 * Tests whether a query string contains any emergency trigger word.
 * Matching is case-insensitive. Whitespace is normalised.
 *
 * @param query - Raw search string or URL query value to test.
 * @returns true if any trigger matches.
 */
export function containsEmergencyTrigger(query: string): boolean {
  const normalised = query.toLowerCase().trim();
  if (normalised.length === 0) {
    return false;
  }
  return ALL_TRIGGERS.some((trigger) => normalised.includes(trigger.toLowerCase()));
}

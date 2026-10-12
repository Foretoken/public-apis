export interface MoonInfo {
  phase: string;
  emoji: string;
  illumination: string;
  description: string;
  fishingBonus: string;
}

export function getMoonDetails(phase: string): MoonInfo {
  switch (phase) {
    case 'New Moon':
      return {
        phase: 'New Moon',
        emoji: '🌑',
        illumination: '0%',
        description: 'The moon is between Earth and the Sun. Maximum tidal gravitational pull stimulates aggressive fish feeding.',
        fishingBonus: '+3 (Peak Feeding Activity)'
      };
    case 'Waxing Crescent':
      return {
        phase: 'Waxing Crescent',
        emoji: '🌒',
        illumination: '1% - 49%',
        description: 'A sliver of light emerges in the western sky after sunset. Planting leafy greens & annual flowers favored.',
        fishingBonus: 'Neutral'
      };
    case 'First Quarter':
      return {
        phase: 'First Quarter',
        emoji: '🌓',
        illumination: '50%',
        description: 'Half illuminated. Neap tide period — fish tend to feed less actively during quarter moons.',
        fishingBonus: '-1 (Quarter Moon Penalty)'
      };
    case 'Waxing Gibbous':
      return {
        phase: 'Waxing Gibbous',
        emoji: '🌔',
        illumination: '51% - 99%',
        description: 'Illumination increasing toward full. Strong moisture pull promotes root and shoot vigor.',
        fishingBonus: 'Neutral'
      };
    case 'Full Moon':
      return {
        phase: 'Full Moon',
        emoji: '🌕',
        illumination: '100%',
        description: 'Full lunar surface lit. Peak gravitational pull; night feeding spike and elevated fish activity.',
        fishingBonus: '+3 (Peak Feeding Activity)'
      };
    case 'Waning Gibbous':
      return {
        phase: 'Waning Gibbous',
        emoji: '🌖',
        illumination: '99% - 51%',
        description: 'Light begins waning. Gravitational pull draws energy downward into root systems. Great for root crop planting.',
        fishingBonus: 'Neutral'
      };
    case 'Last Quarter':
      return {
        phase: 'Last Quarter',
        emoji: '🌗',
        illumination: '50%',
        description: 'Half illuminated on the waning side. Fish feeding slows down slightly.',
        fishingBonus: '-1 (Quarter Moon Penalty)'
      };
    case 'Waning Crescent':
      return {
        phase: 'Waning Crescent',
        emoji: '🌘',
        illumination: '49% - 1%',
        description: 'Final sliver before new moon. Low lunar gravitational influence; optimal for soil cultivation and weeding.',
        fishingBonus: 'Neutral'
      };
    default:
      return {
        phase,
        emoji: '🌙',
        illumination: 'Variable',
        description: 'Lunar phase in synodic orbit.',
        fishingBonus: 'Neutral'
      };
  }
}

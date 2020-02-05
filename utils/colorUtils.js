export default {
  getBackColorByChar (char) {
    switch (char) {
      case 1: // Tairitsu
      case 6: // Tairitsu (Axium)
      case 7: // Tairitsu (Grievous Lady)
        return '#4B384C' // PANTONE 7448 C
      case 2: // Kou
        return '#F57EB6' // PANTONE 211 C
      case 3: // Sapphire
        return '#00635B' // PANTONE 7720 C
      case 4: // Lethe
        return '#C5B783' // PANTONE 4525 C
      case 5: // Hikari & Tairitsu(Unused)
        return '#645B64' // PANTONE 4293 C
      case 8: // Stella
        return '#99D6EA' // PANTONE 2975 C
      case 9: // Hikari & Fisica
        return '#E6A65D' // PANTONE 7411 C
      case 10: // Ilith
        return '#A9431E' // PANTONE 1675 C
      case 11: // Eto
        return '#CBD3EA' // PANTONE 2706 C
      case 12: // Luna
        return '#7D55C7' // PANTONE 2665 C
      case 13: // Shirabe
        return '#802F2D' // PANTONE 7624 C
      case 16: // Hikari (Summer)
      case 17: // Tairitsu (Summer)
        return '#99D6EA' // PANTONE 2975 C
      case 18: // Tairitsu & Trin
        return '#E2665C' // PANTONE 4057 C
      case 19: // Ayu
        return '#00B0B9' // PANTONE 7466 C
      case 20: // Eto & Luna
        return '#A5B0E3' // PANTONE 2113 C
      case 21: // Yume
        return '#FB637E' // PANTONE 1777 C
      case 22: // Hikari & Seine
        return '#C964CF' // PANTONE 252 C
      case 23: // Saya
        return '#005A6F' // PANTONE 7470 C
      case 24: // Tairitsu & Chuni Pengin
        return '#D86018' // PANTONE 1595 C
      case 25: // Chuni Pengin
        return '#EADA24' // PANTONE 604 C
      case 26: // Nono
        return '#D9D9D6' // PANTONE Cool Gray 1 C
      case 27: // Haruna
        return '#AC145A' // PANTONE 215 C
      case 28: // Pandora Nemesis
        return '#717C7D' // PANTONE 444 C
      case 29: // Regulus
        return '#6B3077' // PANTONE 7663 C
      case 30: // Kanae
        return '#D9C756' // PANTONE 458 C
      case 31: // Hikari (Fantasia)
        return '#E3C8D8' // PANTONE 678 C
      case 32: // Tairitsu (Sonata)
        return '#65665C' // PANTONE 417 C
      case 33: // Sia
        return '#9A9500' // PANTONE 391 C
      case 34: // DORO*C
        return '#CFCDC9' // PANTONE 2330 C
      default: // Hikari, Hikari (Zero), Hikari (Fracture)
        return '#E4D5D3' // PANTONE 7604 C
    }
  },
  isTextDarkByChar (char) {
    const dark = [1, 3, 5, 6, 7, 10, 12, 13, 23, 27, 28, 29, 32]
    if (dark.includes(char)) { return false }
    return true
  },
  getBackColorBySide (side) {
    return side === 0 ? '#CFCDC9' : '#4B384C' // PANTONE 2330 C : PANTONE 7448 C
  },
  isTextDarkBySide (side) {
    return side === 0
  },
  getBackColorByLevel (level) {
    if (level >= 8) { // FTR
      return '#8031A7' // PANTONE 527 C
    } else if (level >= 4) { // PRS
      return '#ADDC91' // PANTONE 358 C
    } // PST
    return '#A4DBE8' // PANTONE 635 C
  },
  isTextDarkByLevel (level) {
    if (level >= 8) { return false }
    return true
  },
  getBackColorByPack (pack) {
    switch (pack) {
      case 'core':
        return '#645B64' // PANTONE 4293 C
      case 'shiawase':
        return '#F57EB6' // PANTONE 211 C
      case 'single':
        return '#99D6EA' // PANTONE 2975 C
      case 'dynamix':
        return '#00635B' // PANTONE 7720 C
      case 'mirai':
        return '#C5B783' // PANTONE 4525 C
      case 'yugamu':
        return '#4B384C' // PANTONE 7448 C
      case 'lanota':
        return '#E6A65D' // PANTONE 7411 C
      case 'nijuusei':
        return '#7D55C7' // PANTONE 2665 C
      case 'rei':
        return '#E4D5D3' // PANTONE 7604 C
      case 'tonesphere':
        return '#E2665C' // PANTONE 4057 C
      case 'groovecoaster':
        return '#C964CF' // PANTONE 252 C
      case 'zettai':
        return '#005A6F' // PANTONE 7470 C
      case 'chunithm':
        return '#EADA24' // PANTONE 604 C
      case 'prelude':
        return '#E4D5D3' // PANTONE 7604 C
      case 'omatsuri':
        return '#D9C756' // PANTONE 458 C
      default:
        return '#D9D9D6' // PANTONE Cool Gray 1 C
    }
  },
  isTextDarkByPack (pack) {
    const dark = ['zettai', 'core', 'nijuusei', 'yugamu', 'dynamix']
    if (dark.includes(pack)) { return false }
    return true
  }
}

const taglines = [
    "Vela to the Max",
    "Go For The Gap",
    "Neem ka patta kadva hai, Mohammed Bin Sulayem bhadwa hai",
    "Draft Your Destiny",
    "Absolute Cinema",
    "Lick The Stamp...And Send It",
    "Tough Time Never Last, Only Tough People Last...OBLULLBULBBULULULUULUBLBULB"
];

export async function getRandomTagline() {
    return taglines[Math.floor(Math.random() * taglines.length)];
}
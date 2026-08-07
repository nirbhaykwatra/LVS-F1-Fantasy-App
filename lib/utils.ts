export const taglines = [
    "Vela to the Max",
    "Go For The Gap",
    "Neem ka patta kadva hai, Mohammed Bin Sulayem bhadwa hai",
    "Draft Your Destiny",
    "Absolute Cinema",
    "Lick The Stamp...And Send It",
    "Tough Time Never Last, Only Tough People Last...OBLULLBULBBULULULUULUBLBULB",
    "Always leave the space",
    "MEIN GOTT, MUSS DA SEIN!",
    "You cannot have the drink",
    "Any damage? Yeah. Talent.",
    "Ki ki ki! Rraa! Rraa!",
    "Pierre Gasly"
];

export interface Statistic {
    id: string;
    name: string;
    value: string;
}

export function getPointsText(points: number) {
    return points !== 1 && points !== -1 ? `${points} points` : `${points} point`;
}
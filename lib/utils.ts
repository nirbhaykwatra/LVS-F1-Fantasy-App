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

export const playerFeatures = [
    "Join F1 Fantasy Leagues",
    "Draft your team every race weekend",
    "View race results and driver standings",
    "Compare performance with friends",
    "Use power ups and counterpicks",
];

export const managerFeatures = [
    "Create and manage leagues",
    "Add and remove players",
    "Track points and standings",
    "Customize league settings and rules",
    "Import and export league data",
];

export const tickerItems = [
    "Create your own league",
    "Play against your friends",
    "Spice up your F1 experience",
    "Make your own rules",
    "Analyze your performance",
    "Dive into the data",
    "Unlock power ups",
];


export interface Statistic {
    id: string;
    name: string;
    value: string;
}

export function getPointsText(points: number) {
    return points !== 1 && points !== -1 ? `${points} points` : `${points} point`;
}
// Comprehensive Indian city database with GPS coordinates
// Includes all major cities + extensive Karnataka coverage

export interface City {
    name: string;
    state: string;
    lat: number;
    lng: number;
}

export const INDIAN_CITIES: City[] = [
    // ──────────────── KARNATAKA (comprehensive) ────────────────
    { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
    { name: 'Mysuru', state: 'Karnataka', lat: 12.2958, lng: 76.6394 },
    { name: 'Mangalore', state: 'Karnataka', lat: 12.9141, lng: 74.8560 },
    { name: 'Hubli', state: 'Karnataka', lat: 15.3647, lng: 75.1240 },
    { name: 'Dharwad', state: 'Karnataka', lat: 15.4589, lng: 75.0078 },
    { name: 'Belgaum', state: 'Karnataka', lat: 15.8497, lng: 74.4977 },
    { name: 'Gulbarga', state: 'Karnataka', lat: 17.3297, lng: 76.8343 },
    { name: 'Davangere', state: 'Karnataka', lat: 14.4644, lng: 75.9218 },
    { name: 'Bellary', state: 'Karnataka', lat: 15.1394, lng: 76.9214 },
    { name: 'Bijapur', state: 'Karnataka', lat: 16.8302, lng: 75.7100 },
    { name: 'Shimoga', state: 'Karnataka', lat: 13.9299, lng: 75.5681 },
    { name: 'Tumkur', state: 'Karnataka', lat: 13.3379, lng: 77.1173 },
    { name: 'Raichur', state: 'Karnataka', lat: 16.2120, lng: 77.3439 },
    { name: 'Bidar', state: 'Karnataka', lat: 17.9104, lng: 77.5199 },
    { name: 'Hospet', state: 'Karnataka', lat: 15.2689, lng: 76.3909 },
    { name: 'Hassan', state: 'Karnataka', lat: 13.0072, lng: 76.0962 },
    { name: 'Udupi', state: 'Karnataka', lat: 13.3409, lng: 74.7421 },
    { name: 'Chitradurga', state: 'Karnataka', lat: 14.2226, lng: 76.3980 },
    { name: 'Mandya', state: 'Karnataka', lat: 12.5218, lng: 76.8951 },
    { name: 'Chikmagalur', state: 'Karnataka', lat: 13.3161, lng: 75.7720 },
    { name: 'Kolar', state: 'Karnataka', lat: 13.1360, lng: 78.1292 },
    { name: 'Ramanagara', state: 'Karnataka', lat: 12.7159, lng: 77.2810 },
    { name: 'Karwar', state: 'Karnataka', lat: 14.8127, lng: 74.1240 },
    { name: 'Bagalkot', state: 'Karnataka', lat: 16.1691, lng: 75.6615 },
    { name: 'Gadag', state: 'Karnataka', lat: 15.4166, lng: 75.6355 },
    { name: 'Haveri', state: 'Karnataka', lat: 14.7951, lng: 75.3991 },
    { name: 'Koppal', state: 'Karnataka', lat: 15.3473, lng: 76.1551 },
    { name: 'Yadgir', state: 'Karnataka', lat: 16.7701, lng: 77.1380 },
    { name: 'Chamarajanagar', state: 'Karnataka', lat: 11.9236, lng: 76.9398 },
    { name: 'Kodagu', state: 'Karnataka', lat: 12.4244, lng: 75.7382 },
    { name: 'Chikballapur', state: 'Karnataka', lat: 13.4355, lng: 77.7315 },

    // ──────────────── MAHARASHTRA ────────────────
    { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
    { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
    { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
    { name: 'Nashik', state: 'Maharashtra', lat: 20.0063, lng: 73.7905 },
    { name: 'Aurangabad', state: 'Maharashtra', lat: 19.8762, lng: 75.3433 },
    { name: 'Solapur', state: 'Maharashtra', lat: 17.6599, lng: 75.9064 },
    { name: 'Kolhapur', state: 'Maharashtra', lat: 16.7050, lng: 74.2433 },
    { name: 'Thane', state: 'Maharashtra', lat: 19.2183, lng: 72.9781 },
    { name: 'Navi Mumbai', state: 'Maharashtra', lat: 19.0330, lng: 73.0297 },
    { name: 'Sangli', state: 'Maharashtra', lat: 16.8524, lng: 74.5815 },
    { name: 'Amravati', state: 'Maharashtra', lat: 20.9374, lng: 77.7796 },
    { name: 'Latur', state: 'Maharashtra', lat: 18.4088, lng: 76.5604 },

    // ──────────────── DELHI / NCR ────────────────
    { name: 'New Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Gurgaon', state: 'Haryana', lat: 28.4595, lng: 77.0266 },
    { name: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910 },
    { name: 'Faridabad', state: 'Haryana', lat: 28.4089, lng: 77.3178 },
    { name: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538 },
    { name: 'Greater Noida', state: 'Uttar Pradesh', lat: 28.4744, lng: 77.5040 },

    // ──────────────── TAMIL NADU ────────────────
    { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
    { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
    { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
    { name: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047 },
    { name: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460 },
    { name: 'Tirunelveli', state: 'Tamil Nadu', lat: 8.7139, lng: 77.7567 },
    { name: 'Vellore', state: 'Tamil Nadu', lat: 12.9165, lng: 79.1325 },
    { name: 'Erode', state: 'Tamil Nadu', lat: 11.3410, lng: 77.7172 },
    { name: 'Thanjavur', state: 'Tamil Nadu', lat: 10.7870, lng: 79.1378 },
    { name: 'Hosur', state: 'Tamil Nadu', lat: 12.7409, lng: 77.8253 },

    // ──────────────── TELANGANA ────────────────
    { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
    { name: 'Warangal', state: 'Telangana', lat: 17.9784, lng: 79.5941 },
    { name: 'Nizamabad', state: 'Telangana', lat: 18.6725, lng: 78.0941 },
    { name: 'Karimnagar', state: 'Telangana', lat: 18.4386, lng: 79.1288 },

    // ──────────────── ANDHRA PRADESH ────────────────
    { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
    { name: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
    { name: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192 },
    { name: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365 },
    { name: 'Nellore', state: 'Andhra Pradesh', lat: 14.4426, lng: 79.9865 },
    { name: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lng: 78.0373 },
    { name: 'Anantapur', state: 'Andhra Pradesh', lat: 14.6819, lng: 77.6006 },

    // ──────────────── KERALA ────────────────
    { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
    { name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366 },
    { name: 'Kozhikode', state: 'Kerala', lat: 11.2588, lng: 75.7804 },
    { name: 'Thrissur', state: 'Kerala', lat: 10.5276, lng: 76.2144 },
    { name: 'Kannur', state: 'Kerala', lat: 11.8745, lng: 75.3704 },
    { name: 'Palakkad', state: 'Kerala', lat: 10.7867, lng: 76.6548 },
    { name: 'Alappuzha', state: 'Kerala', lat: 9.4981, lng: 76.3388 },
    { name: 'Kollam', state: 'Kerala', lat: 8.8932, lng: 76.6141 },

    // ──────────────── GUJARAT ────────────────
    { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
    { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
    { name: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812 },
    { name: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022 },
    { name: 'Gandhinagar', state: 'Gujarat', lat: 23.2156, lng: 72.6369 },
    { name: 'Bhavnagar', state: 'Gujarat', lat: 21.7645, lng: 72.1519 },
    { name: 'Junagadh', state: 'Gujarat', lat: 21.5222, lng: 70.4579 },
    { name: 'Jamnagar', state: 'Gujarat', lat: 22.4707, lng: 70.0577 },

    // ──────────────── RAJASTHAN ────────────────
    { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
    { name: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243 },
    { name: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125 },
    { name: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648 },
    { name: 'Ajmer', state: 'Rajasthan', lat: 26.4499, lng: 74.6399 },
    { name: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119 },

    // ──────────────── UTTAR PRADESH ────────────────
    { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
    { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
    { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
    { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319 },
    { name: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463 },
    { name: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064 },
    { name: 'Mathura', state: 'Uttar Pradesh', lat: 27.4924, lng: 77.6737 },
    { name: 'Aligarh', state: 'Uttar Pradesh', lat: 27.8974, lng: 78.0880 },
    { name: 'Bareilly', state: 'Uttar Pradesh', lat: 28.3670, lng: 79.4304 },

    // ──────────────── MADHYA PRADESH ────────────────
    { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
    { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
    { name: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864 },
    { name: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828 },
    { name: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885 },

    // ──────────────── WEST BENGAL ────────────────
    { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
    { name: 'Howrah', state: 'West Bengal', lat: 22.5958, lng: 88.2636 },
    { name: 'Durgapur', state: 'West Bengal', lat: 23.5204, lng: 87.3119 },
    { name: 'Siliguri', state: 'West Bengal', lat: 26.7271, lng: 88.3953 },
    { name: 'Asansol', state: 'West Bengal', lat: 23.6889, lng: 86.9661 },

    // ──────────────── PUNJAB ────────────────
    { name: 'Chandigarh', state: 'Punjab', lat: 30.7333, lng: 76.7794 },
    { name: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723 },
    { name: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573 },
    { name: 'Jalandhar', state: 'Punjab', lat: 31.3260, lng: 75.5762 },
    { name: 'Patiala', state: 'Punjab', lat: 30.3398, lng: 76.3869 },
    { name: 'Bathinda', state: 'Punjab', lat: 30.2110, lng: 74.9455 },

    // ──────────────── HARYANA ────────────────
    { name: 'Ambala', state: 'Haryana', lat: 30.3782, lng: 76.7767 },
    { name: 'Karnal', state: 'Haryana', lat: 29.6857, lng: 76.9905 },
    { name: 'Panipat', state: 'Haryana', lat: 29.3909, lng: 76.9635 },
    { name: 'Hisar', state: 'Haryana', lat: 29.1492, lng: 75.7217 },
    { name: 'Rohtak', state: 'Haryana', lat: 28.8955, lng: 76.6066 },
    { name: 'Dharuhera', state: 'Haryana', lat: 28.2065, lng: 76.7976 },

    // ──────────────── BIHAR ────────────────
    { name: 'Patna', state: 'Bihar', lat: 25.6093, lng: 85.1376 },
    { name: 'Gaya', state: 'Bihar', lat: 24.7914, lng: 85.0002 },
    { name: 'Muzaffarpur', state: 'Bihar', lat: 26.1209, lng: 85.3647 },

    // ──────────────── ODISHA ────────────────
    { name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245 },
    { name: 'Cuttack', state: 'Odisha', lat: 20.4625, lng: 85.8830 },
    { name: 'Rourkela', state: 'Odisha', lat: 22.2604, lng: 84.8536 },
    { name: 'Puri', state: 'Odisha', lat: 19.8135, lng: 85.8312 },

    // ──────────────── JHARKHAND ────────────────
    { name: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096 },
    { name: 'Jamshedpur', state: 'Jharkhand', lat: 22.8046, lng: 86.2029 },
    { name: 'Dhanbad', state: 'Jharkhand', lat: 23.7957, lng: 86.4304 },

    // ──────────────── CHHATTISGARH ────────────────
    { name: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296 },
    { name: 'Bilaspur', state: 'Chhattisgarh', lat: 22.0797, lng: 82.1409 },

    // ──────────────── ASSAM / NORTHEAST ────────────────
    { name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362 },
    { name: 'Imphal', state: 'Manipur', lat: 24.8170, lng: 93.9368 },
    { name: 'Shillong', state: 'Meghalaya', lat: 25.5788, lng: 91.8933 },
    { name: 'Agartala', state: 'Tripura', lat: 23.8315, lng: 91.2868 },

    // ──────────────── GOA ────────────────
    { name: 'Panaji', state: 'Goa', lat: 15.4909, lng: 73.8278 },
    { name: 'Margao', state: 'Goa', lat: 15.2832, lng: 73.9862 },
    { name: 'Vasco da Gama', state: 'Goa', lat: 15.3982, lng: 73.8113 },

    // ──────────────── UTTARAKHAND ────────────────
    { name: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322 },
    { name: 'Haridwar', state: 'Uttarakhand', lat: 29.9457, lng: 78.1642 },
    { name: 'Rishikesh', state: 'Uttarakhand', lat: 30.0869, lng: 78.2676 },
    { name: 'Nainital', state: 'Uttarakhand', lat: 29.3803, lng: 79.4636 },

    // ──────────────── HIMACHAL PRADESH ────────────────
    { name: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734 },
    { name: 'Manali', state: 'Himachal Pradesh', lat: 32.2432, lng: 77.1892 },
    { name: 'Dharamshala', state: 'Himachal Pradesh', lat: 32.2190, lng: 76.3234 },

    // ──────────────── JAMMU & KASHMIR ────────────────
    { name: 'Srinagar', state: 'Jammu & Kashmir', lat: 34.0837, lng: 74.7973 },
    { name: 'Jammu', state: 'Jammu & Kashmir', lat: 32.7266, lng: 74.8570 },

    // ──────────────── OTHERS ────────────────
    { name: 'Bhubaneshwar', state: 'Odisha', lat: 20.2961, lng: 85.8245 },
    { name: 'Pondicherry', state: 'Puducherry', lat: 11.9416, lng: 79.8083 },
    { name: 'Gangtok', state: 'Sikkim', lat: 27.3389, lng: 88.6065 },
];

// ──────────────── ROUTE GENERATION ENGINE ────────────────

// Haversine distance (straight-line km)
export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Road distance ≈ haversine × road factor (Indian highways are curvy)
export function estimateRoadDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const straight = haversineDistance(lat1, lng1, lat2, lng2);
    // Hill areas get a higher multiplier
    const isHilly = lat1 > 28 || lat2 > 28 || (lat1 > 10 && lat1 < 13 && lng1 < 76);
    const factor = isHilly ? 1.45 : 1.3;
    return Math.round(straight * factor);
}

// Station name templates for realistic names
const STATION_NAME_TEMPLATES = [
    '{city} EV SuperCharger',
    '{city} Green Energy Hub',
    '{city} Highway Charge Point',
    '{city} PowerStation',
    '{city} EV Rapid Charger',
    '{city} Smart Charge Hub',
    '{city} Electric Avenue',
    '{city} ChargeZone Station',
    '{city} Tata Power EV Station',
    '{city} EESL Charge Point',
];

const HIGHWAY_NAMES: Record<string, string> = {
    'NH-44': 'Delhi-Chennai (NH-44)',
    'NH-48': 'Delhi-Mumbai (NH-48)',
    'NH-8': 'Mumbai-Ahmedabad (NH-8)',
    'NH-4': 'Mumbai-Bangalore (NH-4)',
    'NH-7': 'Varanasi-Kanyakumari (NH-7)',
    'NH-75': 'Bangalore-Mangalore (NH-75)',
    'NH-275': 'Bangalore-Mysuru (NH-275)',
    'NH-66': 'Mumbai-Goa-Mangalore (NH-66)',
    'NH-52': 'Bangalore-Hubli (NH-52)',
};

const AMENITY_SETS = [
    ['parking', 'restroom'],
    ['parking', 'restroom', 'cafe'],
    ['parking', 'restroom', 'cafe', 'wifi'],
    ['parking', 'restroom', 'food', 'wifi'],
    ['parking', 'restroom', 'cafe', 'wifi', 'food'],
    ['parking', 'restroom', 'cafe', 'wifi', 'food', 'lounge'],
];

export interface ChargingStopData {
    id: string;
    name: string;
    address: string;
    distanceFromStart: number;
    connectorType: string;
    maxPowerKw: number;
    pricePerKwh: number;
    estimatedChargeTimeMin: number;
    estimatedCost: number;
    amenities: string[];
    lat: number;
    lng: number;
    rating: number;
}

export interface TripSegmentData {
    distanceKm: number;
    durationMin: number;
}

export interface GeneratedRoute {
    totalDistanceKm: number;
    totalDurationMin: number;
    stops: ChargingStopData[];
    segments: TripSegmentData[];
}

// Find the nearest city to a point on the route for naming stops
function findNearestCity(lat: number, lng: number, exclude: string[]): City | null {
    let nearest: City | null = null;
    let minDist = Infinity;
    for (const city of INDIAN_CITIES) {
        if (exclude.includes(city.name)) continue;
        const d = haversineDistance(lat, lng, city.lat, city.lng);
        if (d < minDist) {
            minDist = d;
            nearest = city;
        }
    }
    return nearest;
}

// Seeded random for deterministic results per route
function seededRandom(seed: number): () => number {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

/**
 * Generate a realistic EV trip route between two cities.
 * Calculates distance, places charging stops at optimal intervals
 * based on vehicle range, and generates realistic station data.
 */
export function generateRoute(
    startCity: City,
    endCity: City,
    vehicleRangeKm: number,
    connectorPrefs: string[]
): GeneratedRoute {
    const totalDistanceKm = estimateRoadDistance(startCity.lat, startCity.lng, endCity.lat, endCity.lng);

    // Charge at ~70% of range to be safe (never run battery to zero)
    const safeRange = vehicleRangeKm * 0.7;
    const numStops = Math.max(1, Math.ceil(totalDistanceKm / safeRange) - 1);

    // Seed for deterministic station generation per route pair
    const seed = (startCity.name + endCity.name).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const rand = seededRandom(seed);

    const stops: ChargingStopData[] = [];
    const segments: TripSegmentData[] = [];
    const usedCityNames = [startCity.name, endCity.name];

    const avgSpeedKmh = totalDistanceKm > 400 ? 70 : totalDistanceKm > 200 ? 65 : 55;

    for (let i = 0; i < numStops; i++) {
        // Place stops evenly along the route
        const fraction = (i + 1) / (numStops + 1);
        const stopLat = startCity.lat + (endCity.lat - startCity.lat) * fraction;
        const stopLng = startCity.lng + (endCity.lng - startCity.lng) * fraction;
        const distFromStart = Math.round(totalDistanceKm * fraction);

        // Find nearest real city for naming
        const nearestCity = findNearestCity(stopLat, stopLng, usedCityNames);
        const cityName = nearestCity?.name || `Stop ${i + 1}`;
        if (nearestCity) usedCityNames.push(nearestCity.name);

        // Pick station name
        const templateIdx = Math.floor(rand() * STATION_NAME_TEMPLATES.length);
        const stationName = STATION_NAME_TEMPLATES[templateIdx].replace('{city}', cityName);

        // Determine highway name
        const latMid = (startCity.lat + endCity.lat) / 2;
        let highway = 'National Highway';
        if (latMid > 25) highway = 'NH-44';
        else if (startCity.lng < 74 || endCity.lng < 74) highway = 'NH-48';
        else if (latMid < 15) highway = 'NH-75';

        // Connector type
        const connectors = connectorPrefs.length > 0 ? connectorPrefs : ['CCS2', 'Type2', 'CHAdeMO'];
        const connectorType = connectors[i % connectors.length];

        // Power and pricing based on connector
        let maxPowerKw: number, pricePerKwh: number;
        if (connectorType === 'CCS2') {
            maxPowerKw = [50, 60, 120, 150][Math.floor(rand() * 4)];
            pricePerKwh = maxPowerKw >= 120 ? Math.round(18 + rand() * 6) : Math.round(14 + rand() * 4);
        } else if (connectorType === 'CHAdeMO') {
            maxPowerKw = [50, 62.5][Math.floor(rand() * 2)];
            pricePerKwh = Math.round(14 + rand() * 5);
        } else {
            maxPowerKw = [7.2, 11, 22][Math.floor(rand() * 3)];
            pricePerKwh = Math.round(10 + rand() * 5);
        }

        // Charge time: ~70% of safe range worth of energy
        const energyNeededKwh = safeRange * 0.15; // ~150 Wh/km average
        const chargeTimeMin = Math.round((energyNeededKwh / maxPowerKw) * 60);
        const estimatedCost = Math.round(energyNeededKwh * pricePerKwh);

        // Amenities
        const amenityIdx = Math.min(Math.floor(rand() * AMENITY_SETS.length), AMENITY_SETS.length - 1);

        // Rating
        const rating = Math.round((3.5 + rand() * 1.5) * 10) / 10;

        stops.push({
            id: `stop-${seed}-${i}`,
            name: stationName,
            address: `${highway}, near ${cityName}, ${nearestCity?.state || ''}`.trim(),
            distanceFromStart: distFromStart,
            connectorType,
            maxPowerKw,
            pricePerKwh,
            estimatedChargeTimeMin: Math.max(10, chargeTimeMin),
            estimatedCost: Math.max(80, estimatedCost),
            amenities: AMENITY_SETS[amenityIdx],
            lat: nearestCity?.lat || stopLat,
            lng: nearestCity?.lng || stopLng,
            rating,
        });
    }

    // Build segments
    let prevDist = 0;
    for (const stop of stops) {
        const segDist = stop.distanceFromStart - prevDist;
        segments.push({
            distanceKm: segDist,
            durationMin: Math.round((segDist / avgSpeedKmh) * 60),
        });
        prevDist = stop.distanceFromStart;
    }
    // Final segment to destination
    const finalDist = totalDistanceKm - prevDist;
    segments.push({
        distanceKm: finalDist,
        durationMin: Math.round((finalDist / avgSpeedKmh) * 60),
    });

    const totalDriveMin = segments.reduce((a, s) => a + s.durationMin, 0);
    const totalChargeMin = stops.reduce((a, s) => a + s.estimatedChargeTimeMin, 0);

    return {
        totalDistanceKm,
        totalDurationMin: totalDriveMin + totalChargeMin,
        stops,
        segments,
    };
}

// ──────────────── POPULAR ROUTES ────────────────

export interface PopularRoute {
    start: string;
    end: string;
    distanceKm: number;
    tag?: string;
}

export const POPULAR_ROUTES: PopularRoute[] = [
    // Karnataka routes
    { start: 'Bangalore', end: 'Mysuru', distanceKm: 150, tag: 'Karnataka' },
    { start: 'Bangalore', end: 'Mangalore', distanceKm: 352, tag: 'Karnataka' },
    { start: 'Bangalore', end: 'Hubli', distanceKm: 421, tag: 'Karnataka' },
    { start: 'Bangalore', end: 'Belgaum', distanceKm: 502, tag: 'Karnataka' },
    { start: 'Bangalore', end: 'Goa', distanceKm: 561 },
    { start: 'Mysuru', end: 'Mangalore', distanceKm: 260, tag: 'Karnataka' },
    { start: 'Bangalore', end: 'Chennai', distanceKm: 346 },
    { start: 'Bangalore', end: 'Hyderabad', distanceKm: 570 },
    // National routes
    { start: 'New Delhi', end: 'Jaipur', distanceKm: 281 },
    { start: 'New Delhi', end: 'Agra', distanceKm: 233 },
    { start: 'Mumbai', end: 'Pune', distanceKm: 149 },
    { start: 'Mumbai', end: 'Goa', distanceKm: 588 },
    { start: 'Ahmedabad', end: 'Mumbai', distanceKm: 524 },
    { start: 'New Delhi', end: 'Chandigarh', distanceKm: 243 },
    { start: 'Chennai', end: 'Hyderabad', distanceKm: 627 },
    { start: 'Kochi', end: 'Bangalore', distanceKm: 560 },
];

// Helper to find a city by name
export function findCity(name: string): City | undefined {
    return INDIAN_CITIES.find(c => c.name.toLowerCase() === name.toLowerCase());
}

// Search cities by query
export function searchCities(query: string): City[] {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return INDIAN_CITIES
        .filter(c => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q))
        .sort((a, b) => {
            // Prioritize starts-with matches
            const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
            const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
            if (aStarts !== bStarts) return aStarts - bStarts;
            return a.name.localeCompare(b.name);
        })
        .slice(0, 8);
}

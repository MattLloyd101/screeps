module.exports = {
	harvester: {
		basic: {
			roads: { allowed: true },
			container: { allowed: true, count: 5, capacity: 50 },
			spawn: { allowed: false },
			extensions: { allowed: false, },
			ramparts: { allowed: false },
			walls: { allowed: false },
			tower: { allowed: false },
			storage: { allowed: false },
			links: { allowed: false },
			extractor: { allowed: false },
			lab: { allowed: false },
			terminal: { allowed: false },
			observer: { allowed: false },
			powerSpawn: { allowed: false }
		},
		1: {
			roads: { allowed: true },
			container: { allowed: true, count: 5, capacity: 50 },
			spawn: { allowed: true, count: 1 },
			extensions: { allowed: false, },
			ramparts: { allowed: false },
			walls: { allowed: false },
			tower: { allowed: false },
			storage: { allowed: false },
			links: { allowed: false },
			extractor: { allowed: false },
			lab: { allowed: false },
			terminal: { allowed: false },
			observer: { allowed: false },
			powerSpawn: { allowed: false }
		},
		2: {
			roads: { allowed: true },
			container: { allowed: true, count: 5, capacity: 50 },
			spawn: { allowed: true, count: 1 },
			extensions: { allowed: true, count: 5 },
			ramparts: { allowed: true, max: 300000 },
			walls: { allowed: true },
			tower: { allowed: false },
			storage: { allowed: false },
			links: { allowed: false },
			extractor: { allowed: false },
			lab: { allowed: false },
			terminal: { allowed: false },
			observer: { allowed: false },
			powerSpawn: { allowed: false }
		},
		3: {
			roads: { allowed: true },
			container: { allowed: true, count: 5 },
			spawn: { allowed: true, count: 1 },
			extensions: { allowed: true, count: 10, capacity: 50 },
			ramparts: { allowed: true, max: 1000000 },
			walls: { allowed: true },
			tower: { allowed: true, count: 1 },
			storage: { allowed: false },
			links: { allowed: false },
			extractor: { allowed: false },
			lab: { allowed: false },
			terminal: { allowed: false },
			observer: { allowed: false },
			powerSpawn: { allowed: false }
		},
		4: {
			roads: { allowed: true },
			container: { allowed: true, count: 5 },
			spawn: { allowed: true, count: 1 },
			extensions: { allowed: true, count: 20, capacity: 50 },
			ramparts: { allowed: true, max: 3000000 },
			walls: { allowed: true },
			tower: { allowed: true, count: 1 },
			storage: { allowed: true },
			links: { allowed: false },
			extractor: { allowed: false },
			lab: { allowed: false },
			terminal: { allowed: false },
			observer: { allowed: false },
			powerSpawn: { allowed: false }
		},
		5: {
			roads: { allowed: true },
			container: { allowed: true, count: 5 },
			spawn: { allowed: true, count: 1 },
			extensions: { allowed: true, count: 30, capacity: 50 },
			ramparts: { allowed: true, max: 10000000 },
			walls: { allowed: true },
			tower: { allowed: true, count: 2 },
			storage: { allowed: true },
			links: { allowed: true, count: 2 },
			extractor: { allowed: false },
			lab: { allowed: false },
			terminal: { allowed: false },
			observer: { allowed: false },
			powerSpawn: { allowed: false }
		},
		6: {
			roads: { allowed: true },
			container: { allowed: true, count: 5 },
			spawn: { allowed: true, count: 1 },
			extensions: { allowed: true, count: 40, capacity: 50 },
			ramparts: { allowed: true, max: 30000000 },
			walls: { allowed: true },
			tower: { allowed: true, count: 2 },
			storage: { allowed: true },
			links: { allowed: true, count: 3 },
			extractor: { allowed: true },
			lab: { allowed: true, count: 3 },
			terminal: { allowed: true },
			observer: { allowed: false },
			powerSpawn: { allowed: false }
		},
		6: {
			roads: { allowed: true },
			container: { allowed: true, count: 5 },
			spawn: { allowed: true, count: 1 },
			extensions: { allowed: true, count: 40, capacity: 50 },
			ramparts: { allowed: true, max: 30000000 },
			walls: { allowed: true },
			tower: { allowed: true, count: 2 },
			storage: { allowed: true },
			links: { allowed: true, count: 3 },
			extractor: { allowed: true },
			lab: { allowed: true, count: 3 },
			terminal: { allowed: true },
			observer: { allowed: false },
			powerSpawn: { allowed: false }
		},
		7: {
			roads: { allowed: true },
			container: { allowed: true, count: 5 },
			spawn: { allowed: true, count: 2 },
			extensions: { allowed: true, count: 50, capacity: 100 },
			ramparts: { allowed: true, max: 100000000 },
			walls: { allowed: true },
			tower: { allowed: true, count: 3 },
			storage: { allowed: true },
			links: { allowed: true, count: 4 },
			extractor: { allowed: true },
			lab: { allowed: true, count: 6 },
			terminal: { allowed: true },
			observer: { allowed: false },
			powerSpawn: { allowed: false }
		},
		8: {
			roads: { allowed: true },
			container: { allowed: true, count: 5 },
			spawn: { allowed: true, count: 3 },
			extensions: { allowed: true, count: 60, capacity: 200 },
			ramparts: { allowed: true, max: 300000000 },
			walls: { allowed: true },
			tower: { allowed: true, count: 6 },
			storage: { allowed: true },
			links: { allowed: true, count: 6 },
			extractor: { allowed: true },
			lab: { allowed: true, count: 10 },
			terminal: { allowed: true },
			observer: { allowed: true },
			powerSpawn: { allowed: true }
		}
	}
};

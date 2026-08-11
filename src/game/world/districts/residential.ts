import type { DistrictDefinition } from '../types';

export const RESIDENTIAL_DISTRICT: DistrictDefinition = {
  id: 'residential', name: 'СПАЛЬНЫЙ РАЙОН', width: 3200, height: 2200,
  spawn: { x: 560, y: 1450 },
  roads: [
    { id: 'main-road', bounds: { x: 0, y: 920, width: 3200, height: 260 }, direction: 'horizontal', lanes: 2 },
    { id: 'north-road', bounds: { x: 1080, y: 0, width: 180, height: 920 }, direction: 'vertical', lanes: 1 },
    { id: 'east-road', bounds: { x: 2260, y: 1180, width: 180, height: 1020 }, direction: 'vertical', lanes: 1 },
  ],
  buildings: [
    { id: 'house-a', x: 180, y: 220, width: 620, height: 520, label: 'ДОМ 12' },
    { id: 'house-b', x: 1380, y: 180, width: 620, height: 560, label: 'ДОМ 14' },
    { id: 'house-c', x: 2520, y: 170, width: 520, height: 580, label: 'ДОМ 16' },
    { id: 'house-d', x: 220, y: 1380, width: 520, height: 500, label: 'ДОМ 18' },
    { id: 'house-e', x: 1320, y: 1430, width: 620, height: 490, label: 'ДОМ 20' },
    { id: 'shop', x: 2520, y: 1420, width: 520, height: 430, label: 'ПРОДУКТЫ' },
  ],
  props: [
    { id: 'tree-1', kind: 'tree', x: 920, y: 470 }, { id: 'tree-2', kind: 'tree', x: 2140, y: 510 },
    { id: 'tree-3', kind: 'tree', x: 1010, y: 1630 }, { id: 'tree-4', kind: 'tree', x: 2280, y: 1740 },
    { id: 'lamp-1', kind: 'lamp', x: 920, y: 860 }, { id: 'lamp-2', kind: 'lamp', x: 1680, y: 860 },
    { id: 'lamp-3', kind: 'lamp', x: 2460, y: 1280 }, { id: 'park-1', kind: 'parked-car', x: 760, y: 1080 },
    { id: 'park-2', kind: 'parked-car', x: 2020, y: 1080 }, { id: 'sign-center', kind: 'sign', x: 3040, y: 1040 },
  ],
  interactables: [
    { id: 'container-yard', kind: 'container', x: 980, y: 1510, radius: 120, label: 'ОСМОТРЕТЬ МУСОРНЫЙ КОНТЕЙНЕР' },
    { id: 'container-shop', kind: 'container', x: 2420, y: 1580, radius: 120, label: 'ОСМОТРЕТЬ МУСОРНЫЙ КОНТЕЙНЕР' },
    { id: 'bench-yard', kind: 'bench', x: 1140, y: 1510, radius: 110, label: 'СЕСТЬ НА ЛАВОЧКУ' },
    { id: 'bench-stop', kind: 'bench', x: 2050, y: 1120, radius: 110, label: 'СЕСТЬ НА ЛАВОЧКУ' },
    { id: 'shelter-yard', kind: 'shelter', x: 600, y: 1880, radius: 130, label: 'ПЕРЕНОЧЕВАТЬ ЗДЕСЬ' },
    { id: 'district-exit', kind: 'shelter', x: 3050, y: 1040, radius: 120, label: 'ВЫЙТИ К ЦЕНТРУ' },
  ],
};

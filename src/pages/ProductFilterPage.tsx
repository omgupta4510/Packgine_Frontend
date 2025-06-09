import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

// Import all filters
import * as jarFilters from '../data/jarFilters';
import { categories } from '../components/products/CategoryGrid'; // adjust path if needed

import * as bottleFilters from '../data/bottleFilters';
import * as tubeFilters from '../data/tubeFilters';
import * as pouchFilters from '../data/pouchFilters';
import * as stickFilters from '../data/stickFilters';
import * as airlessBottleFilters from '../data/airlessBottleFilters';
import * as airlessJarFilters from '../data/airlessJarFilters';
import * as tottleFilters from '../data/tottleFilters';
import * as compactFilters from '../data/compactFilters'
import { mockProducts } from '../data/mockProducts';

type HeadingMapType = {
  sustainability?: string;
  shape?: string;
  neck?: string;
  type?: string;
  style?: string;
  dispenser?: string;
  fill?: string;
  size?: string;
  minOrder?: string;
  pans?: string;
};

const headingMap: Record<string, HeadingMapType> = {
  bottle: {
    sustainability: 'Sustainability',
    shape: 'Bottle Shape',
    neck: 'Neck Dimension',
  },
  jar: {
    sustainability: 'Sustainability',
    shape: 'Jar Shape',
    neck: 'Neck Dimension',
  },
  tube: {
    sustainability: 'Sustainability',
    type: 'Tube Type',
    shape: 'Tube Shape',
  },
  pouch: {
    sustainability: 'Sustainability',
    style: 'Pouch Style',
    dispenser: 'Dispenser Type',
  },
  stick: {
    sustainability: 'Sustainability',
    shape: 'Stick Shape',
    fill: 'Fill',
  },
 'airless-bottle': {
  sustainability: 'Sustainability',
  shape: 'Shape', 
},
  'airless-jar': {
    sustainability: 'Sustainability',
  },
  tottle: {
    sustainability: 'Sustainability',
  },
  compact: {
    sustainability: 'Sustainability',
    shape: 'Compact Shape',
  },
  default: {
    sustainability: 'Sustainability',
    shape: 'Shape',
    neck: 'Neck Dimension',
  }

};

const packTypes = [
  'Airless Bottle', 'Airless Jar', 'Ampoule', 'Bottle', 'Compact', 'Retail Carton', 'Jar',
  'Lip Gloss Tube', 'Lip Stick', 'Mascara', 'Pouch', 'Preform', 'Roll On', 'Sachet', 'Stick', 'Tottle'
];

const sizes = [
  'Small', 'Medium', 'Large', '50ml', '100ml', '250ml', '500ml', '1L'
];

const locationRegions = [
  {
    region: 'North America',
    countries: [
      { label: 'USA', value: 'usa', flag: '🇺🇸' },
      { label: 'Canada', value: 'canada', flag: '🇨🇦' },
      { label: 'Mexico', value: 'mexico', flag: '🇲🇽' },
    ],
  },
  {
    region: 'Europe',
    countries: [
      { label: 'UK', value: 'uk', flag: '🇬🇧' },
      { label: 'Germany', value: 'germany', flag: '🇩🇪' },
      { label: 'Netherlands', value: 'netherlands', flag: '🇳🇱' },
      { label: 'Spain', value: 'spain', flag: '🇪🇸' },
      { label: 'France', value: 'france', flag: '🇫🇷' },
      { label: 'Italy', value: 'italy', flag: '🇮🇹' },
      { label: 'Belgium', value: 'belgium', flag: '🇧🇪' },
      { label: 'Israel', value: 'israel', flag: '🇮🇱' },
      { label: 'Poland', value: 'poland', flag: '🇵🇱' },
    ],
  },
  {
    region: 'Asia',
    countries: [
      { label: 'China', value: 'china', flag: '🇨🇳' },
      { label: 'Japan', value: 'japan', flag: '🇯🇵' },
      { label: 'South Korea', value: 'south-korea', flag: '🇰🇷' },
      { label: 'India', value: 'india', flag: '🇮🇳' },
      { label: 'Taiwan', value: 'taiwan', flag: '🇹🇼' },
    ],
  },
];

const endUseCategories = [
  {
    label: 'Body Care',
    options: [
      'Body Lotion', 'Body Oil', 'Body Scrub', 'Body Wash', 'Deodorant', 'Hand Cream', 'Hand Soap'
    ]
  },
  {
    label: 'Cosmetics',
    options: [
      'Fragrance'
    ]
  },
  {
    label: 'Face Care',
    options: [
      'Eye', 'Face Cleanser', 'Face Moisturizer', 'Face Serum', 'Lip', 'Toner'
    ]
  },
  {
    label: 'Hair Care',
    options: [
      'Hair Oil', 'Hair Spray', 'Hair Treatment', 'Shampoo Conditioner'
    ]
  },
   {
    label: 'House Hold',
    options: [
      'Dish Soap', 'Laundry Detergent', 'Surface Cleaners'
    ]
  },
  {
    label: 'Beverage',
    options: [
      'Carbonated Beverage', 'Crown Cork', 'Juice', 'Liquor', 'Milk', 'Ready To Drink', 'Water', 'Wine'
    ]
  },
  {
    label: 'Food',
    options: [
      'Dry Foods And Spreads', 'Oils', 'Sauces'
    ]
  },
  {
    label: 'Sampling',
    options: []
  }
];

const colorOptions = [
  { label: 'Amber', value: 'amber', color: '#a05a00' },
  { label: 'Black', value: 'black', color: '#000000' },
  { label: 'Blue', value: 'blue', color: '#4f8cff' },
  { label: 'Clear', value: 'clear', color: '#f5f5f5', border: true },
  { label: 'Green', value: 'green', color: '#8dd35f' },
  { label: 'Grey', value: 'grey', color: '#bdbdbd' },
  { label: 'Gray', value: 'gray', color: '#888888' },
  { label: 'Natural', value: 'natural', color: '#f3eacb' },
  { label: 'Purple', value: 'purple', color: '#a259e6' },
  { label: 'Pink', value: 'pink', color: '#e6a2c7' },
  { label: 'Red', value: 'red', color: '#e65c5c' },
  { label: 'White', value: 'white', color: '#fff', border: true },
  { label: 'Yellow', value: 'yellow', color: '#ffe066' },
  { label: 'Gold', value: 'gold', color: '#ffd700' },
  { label: 'Silver', value: 'silver', color: '#c0c0c0' },
  { label: 'Orange', value: 'orange', color: '#ffa500' },
];
const decoCategories = [
  {
    label: 'Print',
    options: [
      'Digital Print', 'Flexo', 'Gravure Printing', 'Offset Print', 'Silk Screen Print', 'Tampo Pad Print'
    ]
  },
  {
    label: 'Label',
    options: [
      'Heat Transfer Label', 'Labelling'
    ]
  },
  {
    label: 'Other',
    options: [
      'Embossing', 'Etching', 'Heat Stamping', 'Shrink Sleeve', 'Spray Coating'
    ]
  }
];
// Example supplier list (replace with your real data)
const supplierOptions = [
  'Jerhel Plastics Inc',
  'Resilux',
  'AluBottle Co',
  'EcoPack Supplier'
];

const materialCategories = [
  {
    label: 'All Plastic Types',
    options: [
      'ABS', 'Acrylic', 'HDPE', 'LDPE', 'MDPE', 'Nylon', 'PE', 'PET', 'PETG', 'PMMA', 'PP', 'PS', 'PVC', 'SAN', 'Tritan'
    ]
  },
  {
    label: 'All Plant Based',
    options: [
      'Bamboo', 'Paper'
    ]
  },
  {
    label: 'All Metals',
    options: [
      'Aluminum', 'Stainless Steel'
    ]
  },
  {
    label: 'Other',
    options: [
      'Glass', 'Mixed Material'
    ]
  }
];


function getNormalizedSubcategory(filterValue: string): string | null {
  const normalized = (filterValue || '').toLowerCase().replace(/-/g, '');
  for (const mainCat of categories) {
    for (const sub of mainCat.subcategories) {
      if (
        normalized === sub.slug.replace(/-/g, '') ||
        normalized.includes(sub.slug.replace(/-/g, ''))
      ) {
        return sub.slug;
      }
    }
  }
  return null;
}

const ProductFilterPage = () => {
  const { filterType, filterValue } = useParams<{ filterType: string; filterValue: string }>();
  const [packTypeOpen, setPackTypeOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
const [selectedDispenser, setSelectedDispenser] = useState<string>('');
const [selectedFill, setSelectedFill] = useState<string>('');
  const [selectedTubeType, setSelectedTubeType] = useState<string>('');
  const [selectedPackTypes, setSelectedPackTypes] = useState<string[]>([]);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [minOrderOpen, setMinOrderOpen] = useState(false);
  const [minOrderInput, setMinOrderInput] = useState('');
  const [appliedMinOrder, setAppliedMinOrder] = useState('');
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationType, setLocationType] = useState<'manufacturing' | 'warehousing'>('manufacturing');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedShape, setSelectedShape] = useState('');
  const [selectedSustainability, setSelectedSustainability] = useState('');
  const [selectedMOQ, setSelectedMOQ] = useState('');
  const [neckMin, setNeckMin] = useState('');
  const [neckMax, setNeckMax] = useState('');
  const [endUseOpen, setEndUseOpen] = useState(false);
  const [selectedEndUses, setSelectedEndUses] = useState<string[]>([]);
  const [colorOpen, setColorOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [decoOpen, setDecoOpen] = useState(false);
  const [selectedDecos, setSelectedDecos] = useState<string[]>([]);
  const [supplierOpen, setSupplierOpen] = useState(false);
  const [supplierInput, setSupplierInput] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [materialOpen, setMaterialOpen] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [capacityOpen, setCapacityOpen] = useState(false);
  const [capacityMode, setCapacityMode] = useState<'exact' | 'range'>('exact');
  const [capacityValue, setCapacityValue] = useState('');
  const [capacityUnit, setCapacityUnit] = useState<'ml' | 'oz'>('oz');
  const [capacityRange, setCapacityRange] = useState({ min: '', max: '' });
  const [sizeMode, setSizeMode] = useState<'exact' | 'range'>('exact');
  const [sizeValue, setSizeValue] = useState('');
  const [sizeUnit, setSizeUnit] = useState<'ml' | 'oz'>('oz');
  const [sizeRange, setSizeRange] = useState({ min: '', max: '' });


  const handleMaterialChange = (option: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleClearAllMaterial = () => setSelectedMaterials([]);

  const togglePackType = () => setPackTypeOpen((open) => !open);
  const handlePackTypeChange = (type: string) => {
    setSelectedPackTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };
  const toggleSize = () => setSizeOpen((open) => !open);
  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };
  const toggleMinOrder = () => setMinOrderOpen((open) => !open);
  const handleApplyMinOrder = () => setAppliedMinOrder(minOrderInput);
  const handleClearMinOrder = () => {
    setMinOrderInput('');
    setAppliedMinOrder('');
  };
  const toggleLocation = () => setLocationOpen((open) => !open);

  const handleEndUseChange = (option: string) => {
    setSelectedEndUses((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleClearAllEndUse = () => setSelectedEndUses([]);

  const handleDecoChange = (option: string) => {
    setSelectedDecos((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleClearAllDeco = () => setSelectedDecos([]);

  const filteredSuppliers = supplierOptions.filter(s =>
    s.toLowerCase().includes(supplierInput.toLowerCase())
  );

  const handleApplySupplier = () => setSelectedSupplier(supplierInput);
  const handleClearSupplier = () => {
    setSupplierInput('');
    setSelectedSupplier(null);
  };

  const handleApplyCapacity = () => {
    setCapacityOpen(false);
    // Optionally trigger filtering here
  };
  const handleClearCapacity = () => {
    setCapacityValue('');
    setCapacityRange({ min: '', max: '' });
    setCapacityOpen(false);
  };

  // Determine which filters to use based on filterValue (product type)
  let shapes: any[] = [];
  let sustainabilityFilters: any[] = [];
  let locations: any[] = [];
  let moqs: any[] = [];
  let type:any[]=[];
  let dispenser:any[]=[];
  let style: any[]=[];
  let fill: any[]=[];


  const normalizedSubcategory = getNormalizedSubcategory(filterValue || '');


let currentType: keyof typeof headingMap = 'default';

switch (normalizedSubcategory) {
    case 'jar':
      shapes = jarFilters.jarShapes;
      sustainabilityFilters = jarFilters.sustainabilityFilters;
      locations = jarFilters.locations || [];
      moqs = jarFilters.moqs || [];
      currentType = 'jar';
      break;
    case 'bottle':
      shapes = bottleFilters.bottleShapes;
      sustainabilityFilters = bottleFilters.sustainabilityFilters;
      locations = bottleFilters.locations || [];
      moqs = bottleFilters.moqs || [];
      currentType = 'bottle';
      break;
    case 'tube':
      shapes = tubeFilters.tubeShapes;
      type = tubeFilters.tubeTypes;
      sustainabilityFilters = tubeFilters.sustainabilityFilters;
      locations = tubeFilters.locations || [];
      moqs = tubeFilters.moqs || [];
      currentType = 'tube';
      break;
      case 'pouch':
      style = pouchFilters.pouchStyle;
      dispenser=pouchFilters.dispenserType
      sustainabilityFilters = pouchFilters.sustainabilityFilters;
      locations = pouchFilters.locations || [];
      moqs = pouchFilters.moqs || [];
            currentType = 'pouch';

      break;
    case 'stick':
      shapes = stickFilters.stickShapes;
      fill = stickFilters.stickFill;
      sustainabilityFilters = stickFilters.sustainabilityFilters;
      locations = stickFilters.locations || [];
      moqs = stickFilters.moqs || [];
          currentType = 'stick';

      break;
    case 'tottle':
      sustainabilityFilters = tottleFilters.sustainabilityFilters;
      locations = tottleFilters.locations || [];
      moqs = tottleFilters.moqs || [];
                currentType = 'tottle';

      break;
        case 'compact':
      shapes = compactFilters.compactShapes;
      sustainabilityFilters = compactFilters.sustainabilityFilters;
      locations = compactFilters.locations || [];
      moqs = compactFilters.moqs || [];
      currentType = 'compact';
      break;
    case 'airless-bottle':
      shapes = airlessBottleFilters.airlessbottleShapes;
      sustainabilityFilters = airlessBottleFilters.sustainabilityFilters;
      locations = airlessBottleFilters.locations || [];
      moqs = airlessBottleFilters.moqs || [];
          currentType = 'airless-bottle';
      break;
    case 'airless-jar':
      sustainabilityFilters = airlessJarFilters.sustainabilityFilters;
      locations = airlessJarFilters.locations || [];
      moqs = airlessJarFilters.moqs || [];
        currentType = 'airless-jar';
      break;
    default:
      shapes = [];
      sustainabilityFilters = [];
      locations = [];
      moqs = [];
      currentType = 'default';
  }
const headings: HeadingMapType = headingMap[currentType] ?? {};

  // Filter products
  let filtered = mockProducts.filter((product) => {
    if (!filterType || !filterValue) return false;
    return (
      product[filterType as keyof typeof product]?.toString().toLowerCase() === filterValue?.toLowerCase() ||
      filterValue === 'jars' ||
      filterValue === 'bottles' ||
       filterValue === 'tubes' ||
        filterValue === 'pouch' ||
        filterValue === 'sticks' ||
        filterValue === 'tottles' ||
        filterValue === 'compacts' ||
        filterValue === 'airlessbottles' ||
        filterValue === 'airlessjars' 
    );
  });

  if (selectedPackTypes.length > 0) {
    filtered = filtered.filter((p) =>
      selectedPackTypes.includes(
        p.material?.replace(/-/g, ' ') // or p.packType if you have that property
      )
    );
  }

  if (selectedSizes.length > 0) {
    filtered = filtered.filter((p) =>
    selectedSizes.includes(`${p.size}${p.sizeUnit ? p.sizeUnit : ''}`)
    );
  }

  // Size advanced filter
  if (sizeMode === 'exact' && sizeValue) {
    filtered = filtered.filter((p) =>
      (p.sizeUnit === sizeUnit) &&
      (p.size?.toString() === sizeValue)
    );
  }
  if (sizeMode === 'range' && (sizeRange.min || sizeRange.max)) {
    filtered = filtered.filter((p) => {
      if (p.sizeUnit !== sizeUnit) return false;
      const val = Number(p.size);
      const min = sizeRange.min ? Number(sizeRange.min) : -Infinity;
      const max = sizeRange.max ? Number(sizeRange.max) : Infinity;
      return val >= min && val <= max;
    });
  }

  if (appliedMinOrder) {
    filtered = filtered.filter((p) => p.moq >= parseInt(appliedMinOrder));
  }
  if (selectedShape) {
    filtered = filtered.filter((p) => p.shape === selectedShape);
  }
  if (neckMin || neckMax) {
    filtered = filtered.filter((p) => {
      const neck = parseInt((p.neckDimension || '').replace(/\D/g, ''), 10);
      const min = neckMin ? parseInt(neckMin, 10) : -Infinity;
      const max = neckMax ? parseInt(neckMax, 10) : Infinity;
      return neck >= min && neck <= max;
    });
  }
  if (selectedSustainability) {
    filtered = filtered.filter((p) => p.sustainability === selectedSustainability);
  }
  if (selectedLocation) {
    filtered = filtered.filter((p) => p.location === selectedLocation);
  }
  if (selectedMOQ) {
    filtered = filtered.filter((p) => p.moq >= parseInt(selectedMOQ));
  }
  if (selectedEndUses.length > 0) {
    filtered = filtered.filter(
      (p) => Array.isArray(p.endUse) && selectedEndUses.some((eu) => p.endUse?.includes(eu))
    );
  }
  if (selectedColor) {
    filtered = filtered.filter((p) =>
      (p.color || '').toLowerCase() === selectedColor
    );
  }
  if (selectedDecos.length > 0) {
    filtered = filtered.filter(
      (p) => Array.isArray(p.deco) && selectedDecos.some((d) => p.deco?.includes(d))
    );
  }
  if (selectedSupplier) {
    filtered = filtered.filter((p) =>
      (p.supplier || '').toLowerCase().includes(selectedSupplier.toLowerCase())
    );
  }
  if (selectedMaterials.length > 0) {
    filtered = filtered.filter(
      (p) => selectedMaterials.includes(p.material)
    );
  }

  // Capacity advanced filter
  if (capacityMode === 'exact' && capacityValue) {
    filtered = filtered.filter((p) =>
      (p.capacityUnit === capacityUnit) &&
      (p.capacity?.toString() === capacityValue)
    );
  }
  if (capacityMode === 'range' && (capacityRange.min || capacityRange.max)) {
    filtered = filtered.filter((p) => {
      if (p.capacityUnit !== capacityUnit) return false;
      const val = Number(p.capacity);
      const min = capacityRange.min ? Number(capacityRange.min) : -Infinity;
      const max = capacityRange.max ? Number(capacityRange.max) : Infinity;
      return val >= min && val <= max;
    });
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="mt-8">
      <aside className="w-72 bg-white border-r px-6 py-8">
          {/* Sustainability */}
          {headings.sustainability && (
            <h2 className="text-lg font-semibold mb-6">{headings.sustainability}</h2>
          )}
          <div className="space-y-2 mb-8">
            {sustainabilityFilters.map((filter) => (
              <button
                key={filter.value}
                className={`w-full flex items-center px-4 py-2 rounded transition ${
                  selectedSustainability === filter.value
                    ? 'bg-green-100 text-green-700 font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() =>
                  setSelectedSustainability(
                    selectedSustainability === filter.value ? '' : filter.value
                  )
                }
              >
                {filter.label}
              </button>
            ))}
          </div>

         {headings.shape && shapes.length > 0 &&  (
  <>
    <h2 className="text-lg font-semibold mb-4">{headings.shape}</h2>
    <div className="grid grid-cols-2 gap-2 mb-8">
      {shapes.map((shape) => (
        <button
          key={shape.value}
          className={`flex items-center justify-center px-2 py-2 rounded border transition text-sm ${
            selectedShape === shape.value
              ? 'bg-green-100 border-green-400 text-green-700 font-semibold'
              : 'border-gray-200 hover:bg-gray-100 text-gray-700'
          }`}
          onClick={() =>
            setSelectedShape(selectedShape === shape.value ? '' : shape.value)
          }
        >
          {shape.label}
        </button>
      ))}
    </div>
  </>
)}

     {currentType === 'tube' && typeof headings.type === 'string' && type && type.length > 0 &&(
  <>
    <h2 className="text-lg font-semibold mb-4">{headings.type}</h2>
    <div className="grid grid-cols-2 gap-2 mb-8">
      {tubeFilters.tubeTypes.map((type: any) => (
        <button
          key={type.value}
          className={`flex items-center justify-center px-2 py-2 rounded border transition text-sm ${
            selectedTubeType === type.value
              ? 'bg-green-100 border-green-400 text-green-700 font-semibold'
              : 'border-gray-200 hover:bg-gray-100 text-gray-700'
          }`}
          onClick={() =>
            setSelectedTubeType(selectedTubeType === type.value ? '' : type.value)
          }
        >
          {type.label}
        </button>
      ))}
    </div>
  </>
)}
{currentType === 'pouch' && typeof headings.style === 'string' && style && style.length > 0 &&  (
  <>
    <h2 className="text-lg font-semibold mb-4">{headings.style}</h2>
    <div className="grid grid-cols-2 gap-2 mb-8">
      {style.map((s: any) => (
        <button
          key={s.value}
          className={`flex items-center justify-center px-2 py-2 rounded border transition text-sm ${
            selectedStyle === s.value
              ? 'bg-green-100 border-green-400 text-green-700 font-semibold'
              : 'border-gray-200 hover:bg-gray-100 text-gray-700'
          }`}
          onClick={() =>
            setSelectedStyle(selectedStyle === s.value ? '' : s.value)
          }
        >
          {s.label}
        </button>
      ))}
    </div>
  </>
)}
{currentType === 'pouch' && typeof headings.dispenser === 'string' && dispenser && dispenser.length > 0 &&(
  <>
    <h2 className="text-lg font-semibold mb-4">{headings.dispenser}</h2>
    <div className="grid grid-cols-2 gap-2 mb-8">
      {dispenser.map((d: any) => (
        <button
          key={d.value}
          className={`flex items-center justify-center px-2 py-2 rounded border transition text-sm ${
            selectedDispenser === d.value
              ? 'bg-green-100 border-green-400 text-green-700 font-semibold'
              : 'border-gray-200 hover:bg-gray-100 text-gray-700'
          }`}
          onClick={() =>
            setSelectedDispenser(selectedDispenser === d.value ? '' : d.value)
          }
        >
          {d.label}
        </button>
      ))}
    </div>
  </>
)}
{typeof headings.fill === 'string' && fill && fill.length > 0 && (
  <>
    <h2 className="text-lg font-semibold mb-4">{headings.fill}</h2>
    <div className="grid grid-cols-2 gap-2 mb-8">
      {fill.map((f: any) => (
        <button
          key={f.value}
          className={`flex items-center justify-center px-2 py-2 rounded border transition text-sm ${
            selectedFill === f.value
              ? 'bg-green-100 border-green-400 text-green-700 font-semibold'
              : 'border-gray-200 hover:bg-gray-100 text-gray-700'
          }`}
          onClick={() =>
            setSelectedFill(selectedFill === f.value ? '' : f.value)
          }
        >
          {f.label}
        </button>
      ))}
    </div>
  </>
)}
{typeof headings.size === 'string' && (
  <h2 className="text-lg font-semibold mb-4">{headings.size}</h2>
)}
{typeof headings.minOrder === 'string' && (
  <h2 className="text-lg font-semibold mb-4">{headings.minOrder}</h2>
)}
{typeof headings.pans === 'string' && (
  <h2 className="text-lg font-semibold mb-4">{headings.pans}</h2>
)}
{headings.neck && (
  <>
    <h2 className="text-lg font-semibold mb-4">{headings.neck}</h2>
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="number"
              min="0"
              placeholder="Min (mm)"
              className="border rounded px-2 py-1 w-20"
              value={neckMin}
              onChange={(e) => setNeckMin(e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              min="0"
              placeholder="Max (mm)"
              className="border rounded px-2 py-1 w-20"
              value={neckMax}
              onChange={(e) => setNeckMax(e.target.value)}
            />
          </div>
          <button
            className="mb-8 text-green-700 underline text-sm"
            onClick={() => {
              setNeckMin('');
              setNeckMax('');
            }}
          >
            Clear Neck Filter
          </button>
  </>
)}


          

          {/* Material */}
          <div className="mb-4">
            <button
              className="flex items-center font-semibold text-lg mb-2 space-x-2"
              onClick={() => setMaterialOpen((open) => !open)}
              type="button"
            >
              <span>Material</span>
              <span className={`text-xs transition-transform ${materialOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {materialOpen && (
              <div>
                {materialCategories.map((cat) => (
                  <div key={cat.label} className="mb-2">
                    <label className="flex items-center space-x-2 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={cat.options.every(opt => selectedMaterials.includes(opt))}
                        onChange={() => {
                          const allSelected = cat.options.every(opt => selectedMaterials.includes(opt));
                          setSelectedMaterials((prev) =>
                            allSelected
                              ? prev.filter((m) => !cat.options.includes(m))
                              : [...prev, ...cat.options.filter(opt => !prev.includes(opt))]
                          );
                        }}
                      />
                      <span>{cat.label} –</span>
                    </label>
                    {cat.options.map((option) => (
                      <label key={option} className="flex items-center space-x-2 text-sm mb-1 ml-5">
                        <input
                          type="checkbox"
                          checked={selectedMaterials.includes(option)}
                          onChange={() => handleMaterialChange(option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                ))}
                <button
                  className="text-green-700 underline text-sm ml-2"
                  onClick={handleClearAllMaterial}
                  type="button"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Pack Type */}
          <div className="mb-4">
            <button
              className="flex items-center font-semibold text-lg mb-2 space-x-2"
              onClick={togglePackType}
              type="button"
            >
              <span>Pack Type</span>
              <span className={`text-xs transition-transform ${packTypeOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {packTypeOpen && (
              <div className="pl-2 space-y-1">
                {packTypes.map((type) => (
                  <label key={type} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedPackTypes.includes(type)}
                      onChange={() => handlePackTypeChange(type)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Size - Advanced UI */}
          <div className="mb-4">
            <button
              className="flex items-center font-semibold text-lg mb-2 space-x-2"
              onClick={toggleSize}
              type="button"
            >
              <span>Size</span>
              <span className={`text-xs transition-transform ${sizeOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {sizeOpen && (
              <div>
                <div className="flex items-center mb-3 space-x-4">
                  <span
                    className={`cursor-pointer ${sizeMode === 'exact' ? 'text-green-700 font-semibold' : 'text-gray-500'}`}
                    onClick={() => setSizeMode('exact')}
                  >
                    Exact Match
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sizeMode === 'range'}
                      onChange={() => setSizeMode(sizeMode === 'exact' ? 'range' : 'exact')}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-400 transition"></div>
                    <div
                      className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full shadow transition-transform ${
                        sizeMode === 'range' ? 'translate-x-4' : ''
                      }`}
                    ></div>
                  </label>
                  <span
                    className={`cursor-pointer ${sizeMode === 'range' ? 'text-green-700 font-semibold' : 'text-gray-500'}`}
                    onClick={() => setSizeMode('range')}
                  >
                    Range
                  </span>
                </div>
                {sizeMode === 'exact' ? (
                  <input
                    type="text"
                    className="border rounded px-3 py-2 w-full mb-3"
                    placeholder={`Fill (${sizeUnit})`}
                    value={sizeValue}
                    onChange={e => setSizeValue(e.target.value)}
                  />
                ) : (
                  <div className="flex items-center space-x-2 mb-3">
                    <input
                      type="text"
                      className="border rounded px-2 py-2 w-20"
                      placeholder="Min"
                      value={sizeRange.min}
                      onChange={e => setSizeRange(r => ({ ...r, min: e.target.value }))}
                    />
                    <span>-</span>
                    <input
                      type="text"
                      className="border rounded px-2 py-2 w-20"
                      placeholder="Max"
                      value={sizeRange.max}
                      onChange={e => setSizeRange(r => ({ ...r, max: e.target.value }))}
                    />
                  </div>
                )}
                <div className="flex items-center mb-3 space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={sizeUnit === 'ml'}
                      onChange={() => setSizeUnit('ml')}
                    />
                    <span>ml</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={sizeUnit === 'oz'}
                      onChange={() => setSizeUnit('oz')}
                    />
                    <span>oz</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Minimum Order */}
          <div className="mb-4">
            <button
              className="flex items-center font-semibold text-lg mb-2 space-x-2"
              onClick={toggleMinOrder}
              type="button"
            >
              <span>Minimum Order</span>
              <span className={`text-xs transition-transform ${minOrderOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {minOrderOpen && (
              <div className="pl-2 space-y-2">
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-full"
                  placeholder="# of units"
                  value={minOrderInput}
                  onChange={(e) => setMinOrderInput(e.target.value)}
                />
                <div className="flex items-center space-x-4">
                  <button
                    className="flex items-center text-green-700 border border-green-400 rounded-full px-3 py-1 text-sm"
                    onClick={handleApplyMinOrder}
                    type="button"
                  >
                    <span className="mr-1">✔</span> Apply Filter
                  </button>
                  <button
                    className="text-green-700 underline text-sm"
                    onClick={handleClearMinOrder}
                    type="button"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="mb-4">
            <button
              className="flex items-center font-semibold text-lg mb-2 space-x-2"
              onClick={toggleLocation}
              type="button"
            >
              <span>Location</span>
              <span className={`text-xs transition-transform ${locationOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {locationOpen && (
              <div>
                <div className="flex items-center mb-4 space-x-4">
                  <span
                    className={`cursor-pointer ${locationType === 'manufacturing' ? 'text-green-700 font-semibold' : 'text-gray-500'}`}
                    onClick={() => setLocationType('manufacturing')}
                  >
                    Manufacturing
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={locationType === 'warehousing'}
                      onChange={() =>
                        setLocationType(locationType === 'manufacturing' ? 'warehousing' : 'manufacturing')
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-400 transition"></div>
                    <div
                      className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full shadow transition-transform ${
                        locationType === 'warehousing' ? 'translate-x-4' : ''
                      }`}
                    ></div>
                  </label>
                  <span
                    className={`cursor-pointer ${locationType === 'warehousing' ? 'text-green-700 font-semibold' : 'text-gray-500'}`}
                    onClick={() => setLocationType('warehousing')}
                  >
                    Warehousing
                  </span>
                </div>
                {locationRegions.map((region) => (
                  <div key={region.region} className="mb-2">
                    <div className="font-semibold text-gray-700 mb-1">{region.region}</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {region.countries.map((country) => (
                        <button
                          key={country.value}
                          className={`flex items-center px-3 py-1 rounded-full border transition text-sm
                            ${selectedLocation === country.value
                              ? 'bg-green-100 border-green-400 text-green-700 font-semibold'
                              : 'border-gray-200 hover:bg-gray-100 text-gray-700'
                            }`}
                          onClick={() =>
                            setSelectedLocation(selectedLocation === country.value ? '' : country.value)
                          }
                          type="button"
                        >
                          <span className="mr-1">{country.flag}</span>
                          {country.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* End Use */}
          <div className="mb-4">
            <button
              className="flex items-center font-semibold text-lg mb-2 space-x-2"
              onClick={() => setEndUseOpen((open) => !open)}
              type="button"
            >
              <span>End Use</span>
              <span className={`text-xs transition-transform ${endUseOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {endUseOpen && (
              <div>
                {endUseCategories.map((cat) => (
                  <div key={cat.label} className="mb-2">
                    <div className="font-semibold text-gray-700 mb-1">{cat.label} <span className="font-normal">–</span></div>
                    {cat.options.length > 0 ? (
                      cat.options.map((option) => (
                        <label key={option} className="flex items-center space-x-2 text-sm mb-1 ml-2">
                          <input
                            type="checkbox"
                            checked={selectedEndUses.includes(option)}
                            onChange={() => handleEndUseChange(option)}
                          />
                          <span>{option}</span>
                        </label>
                      ))
                    ) : null}
                  </div>
                ))}
                <button
                  className="text-green-700 underline text-sm ml-2"
                  onClick={handleClearAllEndUse}
                  type="button"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Color */}
          <div className="mb-4">
            <button
              className="flex items-center font-semibold text-lg mb-2 space-x-2"
              onClick={() => setColorOpen((open) => !open)}
              type="button"
            >
              <span>Color</span>
              <span className={`text-xs transition-transform ${colorOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {colorOpen && (
              <div>
                <div className="text-sm text-gray-700 mb-2">Stock Colors</div>
                <div className="grid grid-cols-2 gap-2">
                  {colorOptions.map((opt) => (
                    <button
                      key={opt.value}
                      className={`flex items-center w-full px-2 py-1 rounded-full border transition text-sm
                        ${selectedColor === opt.value
                          ? 'bg-green-100 border-green-400 text-green-700 font-semibold'
                          : 'border-gray-200 hover:bg-gray-100 text-gray-700'
                        }`}
                      onClick={() => setSelectedColor(selectedColor === opt.value ? null : opt.value)}
                      type="button"
                    >
                      <span
                        className="inline-block w-5 h-5 rounded-full mr-2 border"
                        style={{
                          backgroundColor: opt.color,
                          borderColor: opt.border ? '#bbb' : opt.color,
                          borderWidth: '2px'
                        }}
                      ></span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Deco */}
          <div className="mb-4">
            <button
              className="flex items-center font-semibold text-lg mb-2 space-x-2"
              onClick={() => setDecoOpen((open) => !open)}
              type="button"
            >
              <span>Deco</span>
              <span className={`text-xs transition-transform ${decoOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {decoOpen && (
              <div>
                {decoCategories.map((cat) => (
                  <div key={cat.label} className="mb-2">
                    <div className="font-semibold text-gray-700 mb-1">{cat.label}</div>
                    {cat.options.map((option) => (
                      <label key={option} className="flex items-center space-x-2 text-sm mb-1 ml-2">
                        <input
                          type="checkbox"
                          checked={selectedDecos.includes(option)}
                          onChange={() => handleDecoChange(option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                ))}
                <button
                  className="text-green-700 underline text-sm ml-2"
                  onClick={handleClearAllDeco}
                  type="button"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Supplier */}
          <div className="mb-4">
            <button
              className="flex items-center font-semibold text-lg mb-2 space-x-2"
              onClick={() => setSupplierOpen((open) => !open)}
              type="button"
            >
              <span>Supplier</span>
              <span className={`text-xs transition-transform ${supplierOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {supplierOpen && (
              <div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="border rounded px-3 py-2 w-full"
                    placeholder="Search Suppliers.."
                    value={supplierInput}
                    onChange={e => setSupplierInput(e.target.value)}
                    list="supplier-list"
                  />
                  <datalist id="supplier-list">
                    {filteredSuppliers.map(s => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    className="flex items-center text-green-700 border border-green-400 rounded-full px-3 py-1 text-sm"
                    onClick={handleApplySupplier}
                    type="button"
                  >
                    <span className="mr-1">✔</span> Apply Filter
                  </button>
                  <button
                    className="text-green-700 underline text-sm"
                    onClick={handleClearSupplier}
                    type="button"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-8 py-8">
        <div className="mt-8">
          <div className="flex items-center mb-4 text-sm text-gray-500 space-x-2">
            <span>All Products</span>
            <span>&gt;</span>
            <span className="text-green-700 font-semibold capitalize">
              {filterValue?.replace(/-/g, ' ')}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-6 capitalize">
            {filterValue?.replace(/-/g, ' ')}
          </h1>
          <div className="flex space-x-4 mb-6">
            <select
              className="border rounded px-3 py-2"
              value={selectedMOQ}
              onChange={(e) => setSelectedMOQ(e.target.value)}
            >
              <option value="">MOQ</option>
              {moqs.slice(1).map((moq) => (
                <option key={moq.value} value={moq.value}>
                  {moq.label}
                </option>
              ))}
            </select>
            <div className="relative ">
              <button
                className="border rounded px-3 py-2 flex bg-gray-200 items-center"
                onClick={() => setCapacityOpen((open) => !open)}
                type="button"
              >
                <span>Capacity</span>
                <svg
                  className={`ml-2 w-4 h-4 transition-transform ${capacityOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {capacityOpen && (
                <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg p-4 w-64">
                  <div className="flex items-center mb-3 space-x-4">
                    <span
                      className={`cursor-pointer ${capacityMode === 'exact' ? 'text-green-700 font-semibold' : 'text-gray-500'}`}
                      onClick={() => setCapacityMode('exact')}
                    >
                      Exact Match
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={capacityMode === 'range'}
                        onChange={() => setCapacityMode(capacityMode === 'exact' ? 'range' : 'exact')}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-400 transition"></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full shadow transition-transform ${
                          capacityMode === 'range' ? 'translate-x-4' : ''
                        }`}
                      ></div>
                    </label>
                    <span
                      className={`cursor-pointer ${capacityMode === 'range' ? 'text-green-700 font-semibold' : 'text-gray-500'}`}
                      onClick={() => setCapacityMode('range')}
                    >
                      Range
                    </span>
                  </div>
                  {capacityMode === 'exact' ? (
                    <input
                      type="text"
                      className="border rounded px-3 py-2 w-full mb-3"
                      placeholder={`Fill (${capacityUnit})`}
                      value={capacityValue}
                      onChange={e => setCapacityValue(e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="text"
                        className="border rounded px-2 py-2 w-20"
                        placeholder="Min"
                        value={capacityRange.min}
                        onChange={e => setCapacityRange(r => ({ ...r, min: e.target.value }))}
                      />
                      <span>-</span>
                      <input
                        type="text"
                        className="border rounded px-2 py-2 w-20"
                        placeholder="Max"
                        value={capacityRange.max}
                        onChange={e => setCapacityRange(r => ({ ...r, max: e.target.value }))}
                      />
                    </div>
                  )}
                  <div className="flex items-center mb-3 space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={capacityUnit === 'ml'}
                        onChange={() => setCapacityUnit('ml')}
                      />
                      <span>ml</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={capacityUnit === 'oz'}
                        onChange={() => setCapacityUnit('oz')}
                      />
                      <span>oz</span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      className="text-green-700 font-semibold underline"
                      onClick={handleApplyCapacity}
                      type="button"
                    >
                      Apply Filter
                    </button>
                    <button
                      className="text-gray-700 underline"
                      onClick={handleClearCapacity}
                      type="button"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
            <select
              className="border rounded px-3 py-2"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Ships from</option>
              {locations.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>
          <div className="text-gray-500 mb-4">
            {filtered.length} Products
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow p-6 flex flex-col items-center relative"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-32 h-48 object-contain mb-4"
                  />
                  <h2 className="text-lg font-semibold mb-2 text-center">{product.title}</h2>
                  <div className="text-sm text-gray-500 mb-1">
                    <span className="font-medium">Minimum Order Qty:</span> {product.moq}
                  </div>
                  <div className="flex space-x-2 mt-2">
                    {product.sustainability && (
                      <span className="inline-block bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
                        {product.sustainability.replace(/-/g, ' ')}
                      </span>
                    )}
                    {product.material && (
                      <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {product.material.replace(/-/g, ' ')}
                      </span>
                    )}
                    {product.neckDimension && (
                      <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                        {product.neckDimension}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-gray-500">No products found for this filter.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductFilterPage;
import React, { useState } from 'react';
import './SpeciesDashboard.css';

// ---------- Types ----------
type Graph = {
  image: string;
  caption: string;
};

type Species = {
  id: string;
  name: string;
  commonName: string;
  description: string;
  graphs: Graph[];
};

type CategoryKey = 'vertebrates' | 'phytoplanktons';

type SpeciesData = {
  [key in CategoryKey]: {
    title: string;
    species: Species[];
  };
};

// ---------- Data ----------
const speciesData: SpeciesData = {
  vertebrates: {
    title: 'Vertebrates',
    species: [
      {
        id: 'clupea-harengus',
        name: 'Clupea harengus',
        commonName: 'Atlantic herring',
        description:
          'A species of herring found in the North Atlantic Ocean, important in commercial fisheries.',
        graphs: [
          {
            image: '/assets/vertebrates/clupea_harengus_1.png',
            caption: 'Seasonal abundance (Sample 1)',
          },
          {
            image: '/assets/vertebrates/clupea_harengus_2.png',
            caption: 'Seasonal abundance (Sample 2)',
          },
        ],
      },
      // Add more vertebrate species here
    ],
  },
  phytoplanktons: {
    title: 'Phytoplanktons',
    species: [
      {
        id: 'species-x',
        name: 'Species X',
        commonName: 'Green Microalgae',
        description:
          'An important phytoplankton group responsible for oxygen production and carbon fixation.',
        graphs: [
          {
            image: '/assets/phytoplanktons/species_x_1.png',
            caption: 'Monthly presence (Sample 1)',
          },
          {
            image: '/assets/phytoplanktons/species_x_2.png',
            caption: 'Monthly presence (Sample 2)',
          },
        ],
      },
      // Add more phytoplanktons here
    ],
  },
};

// ---------- Component ----------
const SpeciesDashboard: React.FC = () => {
  const [category, setCategory] = useState<CategoryKey>('vertebrates');
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>(
    speciesData.vertebrates.species[0].id
  );

  const handleCategoryChange = (newCategory: CategoryKey) => {
    setCategory(newCategory);
    setSelectedSpeciesId(speciesData[newCategory].species[0].id);
  };

  const currentSpeciesList = speciesData[category].species;
  const currentSpecies = currentSpeciesList.find((s) => s.id === selectedSpeciesId)!;

  return (
    <div className="dashboard-container">
      <h1>🧬 Seasonal Monitoring Dashboard</h1>
      <p>
        This page provides seasonal DNA abundance data for different species
        identified in environmental samples. Select between vertebrates or phytoplanktons, then explore individual species.
      </p>

      {/* Category Selector */}
      <div className="selector">
        {(['vertebrates', 'phytoplanktons'] as CategoryKey[]).map((key) => (
          <button
            key={key}
            className={`selector-button ${key === category ? 'active' : ''}`}
            onClick={() => handleCategoryChange(key)}
          >
            {speciesData[key].title}
          </button>
        ))}
      </div>

      {/* Species Selector */}
      <div className="selector">
        {currentSpeciesList.map((species) => (
          <button
            key={species.id}
            className={`selector-button ${
              species.id === selectedSpeciesId ? 'active' : ''
            }`}
            onClick={() => setSelectedSpeciesId(species.id)}
          >
            {species.name}
          </button>
        ))}
      </div>

      {/* Species Description */}
      <div className="species-card">
        <h2>
          <em>{currentSpecies.name}</em> ({currentSpecies.commonName})
        </h2>
        <p>{currentSpecies.description}</p>
      </div>

      {/* Graphs */}
      <div className="graph-grid">
        {currentSpecies.graphs.map((graph, i) => (
          <div className="graph-item" key={i}>
            <img src={graph.image} alt={`Graph ${i + 1}`} />
            <p>{graph.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeciesDashboard;

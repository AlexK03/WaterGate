import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './style.css'; // 👈 Using external CSS

// 🖼️ Local logo imports
import emodnetLogo from '/logos/emodnet-logo.jpg';
import emoBonLogo from '/logos/emo-bon-logo.png';
import marineDataProviderLogo from '/logos/marine-data-provider-logo.png';

// 📊 Static data
const dataSources = [
  {
    id: 'emodnet',
    name: 'EMODnet',
    logo: emodnetLogo,
    description:
      'A pan-European network providing open and standardized marine data, products, and services to support ocean research, policy development, and sustainable marine resource management.',
    links: [
      { label: 'Website', url: 'https://emodnet.ec.europa.eu' },
    ],
  },
  {
    id: 'emo-bon',
    name: 'EMO BON',
    logo: emoBonLogo,
    description:
      'A collaborative European initiative integrating omics technologies into marine biodiversity observation, advancing research, monitoring, and data sharing across ocean ecosystems.',
    links: [
      { label: 'Website', url: 'https://www.embrc.eu/emo-bon/' },
    ],
  },
  {
    id: 'marine-data-provider',
    name: 'Global Fishing Watch',
    logo: marineDataProviderLogo,
    description:
      'A global non-profit organization providing open-access data and advanced analytics to monitor fishing activity and promote ocean transparency.',
    links: [
      { label: 'Home', url: 'https://globalfishingwatch.org' },
      { label: 'About', url: 'https://marine-data-provider.eu/about' },
    ],
  },
];

const AUTO_CLOSE_MS = 8000;

const DataSourcesPanel = () => {
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const autoCloseTimerRef = useRef<number | null>(null);

  const toggleSource = (id: string) => {
    setActiveSource((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (activeSource) {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
      autoCloseTimerRef.current = setTimeout(() => {
        setActiveSource(null);
      }, AUTO_CLOSE_MS);
    } else {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    }

    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, [activeSource]);

  const activeData = dataSources.find((ds) => ds.id === activeSource);

  return (
    <motion.section
      className="data-sources-section"
      animate={{ height: activeSource ? 'auto' : 120 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="header-row">
        <div className="logo-row">
          {dataSources.map((source) => (
            <motion.img
              key={source.id}
              src={source.logo}
              alt={source.name}
              className={`logo ${activeSource === source.id ? 'active' : ''}`}
              whileHover={{ scale: 1.1, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSource(source.id)}
            />
          ))}
        </div>

        <div
          className="toggle-icon"
          onClick={() =>
            setActiveSource((prev) => (prev ? null : dataSources[0].id))
          }
        >
          {activeSource ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeData && (
          <motion.div
            className="details-slide"
            key={activeData.id}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 60, damping: 20 }}
          >
            <h4>{activeData.name}</h4>
            <p>{activeData.description}</p>
            <ul>
              {activeData.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default DataSourcesPanel;

import { motion } from 'framer-motion';
import { Dna, Target, Globe, Shield } from 'lucide-react';

export default function MissionSection() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6 md:px-16 lg:px-32" id="mission">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          className="flex items-center justify-center mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-blue-100 p-3 rounded-full">
            <Dna className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Mission & Vision
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-gray-700 leading-relaxed mb-16 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          At <span className="font-semibold text-blue-700">sEaDNA</span>, we track changes in ocean biodiversity by analyzing the evolving DNA signatures of marine species — from vertebrates to phytoplankton and beyond.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.div
            className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <div className="card-header">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="card-title text-sm text-blue-600 font-medium">Mission Focus</h4>
              </div>
            </div>
            <div className="card-content">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Monitoring Biodiversity</h3>
              <p className="text-gray-600 leading-relaxed">
                Using molecular data from sampling stations across Europe, we monitor species diversity and presence over time. This allows us to detect and trace changes in habitats and entire ecosystems, bringing clarity to the ocean's complex dynamics.
              </p>
              <div className="mt-4 flex items-center text-sm text-blue-600 font-medium">
                <Target className="w-4 h-4 mr-2" />
                Real-time ecosystem monitoring
              </div>
            </div>
          </motion.div>

          <motion.div
            className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <div className="card-header">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="card-title text-sm text-green-600 font-medium">Our Vision</h4>
              </div>
            </div>
            <div className="card-content">
              <h3 className="text-xl font-bold text-green-900 mb-4">Empowering Ocean Stewardship</h3>
              <p className="text-gray-600 leading-relaxed">
                Our mission is to turn molecular data into meaningful action. By making open data accessible and usable, we support decision-making, enhance sustainability strategies in the blue economy, and empower communities to protect marine life every day.
              </p>
              <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
                <Target className="w-4 h-4 mr-2" />
                Data-driven conservation
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Additional stats or features section */}
        <motion.div
          className="mt-20 mb-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div
            className="text-center"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dna className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Molecular Analysis</h4>
            <p className="text-gray-600 text-sm">Advanced DNA sequencing for species identification</p>
          </motion.div>

          <motion.div
            className="text-center"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Global Coverage</h4>
            <p className="text-gray-600 text-sm">Monitoring stations across European waters</p>
          </motion.div>

          <motion.div
            className="text-center"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Open Data</h4>
            <p className="text-gray-600 text-sm">Freely accessible research data for all</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

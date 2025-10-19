import { motion } from 'framer-motion';

export default function MissionSection() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6 md:px-16 lg:px-32" id="mission">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Mission & Goal
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
          className="grid md:grid-cols-2 gap-12 text-left"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.div
            className="bg-white p-8 md:p-10 rounded-xl shadow-2xl border-l-8 border-blue-500 hover:shadow-blue-200 transition-shadow duration-300"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Monitoring Biodiversity</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Using molecular data from sampling stations across Europe, we monitor species diversity and presence over time. This allows us to detect and trace changes in habitats and entire ecosystems, bringing clarity to the ocean’s complex dynamics.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-8 md:p-10 rounded-xl shadow-2xl border-l-8 border-green-500 hover:shadow-green-200 transition-shadow duration-300"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <h3 className="text-2xl font-bold text-green-800 mb-4">Empowering Ocean Stewardship</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our mission is to turn molecular data into meaningful action. By making open data accessible and usable, we support decision-making, enhance sustainability strategies in the blue economy, and empower communities to protect marine life every day.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

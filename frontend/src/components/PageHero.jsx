import { motion } from 'framer-motion'
import Img from './Img.jsx'
import Breadcrumb from './Breadcrumb.jsx'

export default function PageHero({ image = 'city', title, subtitle, crumb }) {
  return (
    <section className="relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <Img src={image} alt="" className="absolute inset-0" imgClassName="opacity-40" eager />
        <div className="absolute inset-0 hero-overlay" />
      </div>
      <div className="container-x relative flex min-h-40 flex-col justify-center py-10 sm:min-h-52 sm:py-14 lg:min-h-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Breadcrumb crumb={crumb} light />
        </motion.div>
        <motion.h1
          className="mt-3 max-w-2xl font-display text-2xl font-semibold text-white sm:text-3xl lg:text-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="mt-3 max-w-xl text-sm text-slate-200 sm:text-base"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  )
}

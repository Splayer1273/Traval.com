import Img from './Img.jsx'
import Breadcrumb from './Breadcrumb.jsx'

export default function PageHero({ image = 'city', title, subtitle, crumb }) {
  return (
    <section className="relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <Img src={image} alt="" className="absolute inset-0" imgClassName="opacity-40" eager />
        <div className="absolute inset-0 hero-overlay" />
      </div>
      <div className="container-x relative flex min-h-52 flex-col justify-center py-14 sm:min-h-64">
        <Breadcrumb crumb={crumb} light />
        <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-xl text-sm text-slate-200 sm:text-base">{subtitle}</p>}
      </div>
    </section>
  )
}

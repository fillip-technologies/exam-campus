import { Link } from 'react-router-dom'

export default function NotFound({ message = 'This admin page does not exist.' }) {
  return (
    <div className="py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-wider text-primary-600">Not found</p>
      <p className="mt-2 text-slate-600">{message}</p>
      <Link to="/admin" className="mt-4 inline-block font-semibold text-primary-700 hover:underline">
        Back to dashboard
      </Link>
    </div>
  )
}

const NAVY   = '#1e1b4b'
const PURPLE = '#7c3aed'

const QTY_OPTIONS = [100,200,300,400,500,600,700,800,900,1000,2000,3000]

function QuantitySelector({ value, onChange }) {
  return (
    <select value={value} onChange={e => onChange(Number(e.target.value))}
      className="px-4 py-2.5 rounded-xl border-2 text-sm font-bold outline-none
                 transition-all cursor-pointer bg-white"
      style={{ borderColor: PURPLE, color: NAVY, minWidth: '140px' }}>
      {QTY_OPTIONS.map(q => (
        <option key={q} value={q}>{q.toLocaleString('fr-DZ')} unités</option>
      ))}
    </select>
  )
}

export default QuantitySelector
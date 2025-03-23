export default function EntryField({
  type,
  label,
  placeholder,
  onChange,
  value,
}) {
  return (
    <>
      <label className="mt-3">{label}</label>
      <input
        className="border-1 pl-4 py-2 pr-5 rounded-lg text-md w-[100%]"
        placeholder={placeholder}
        type={type}
        onChange={onChange}
        value={value}
      />
    </>
  );
}

export function Button({ type, label, color }) {
  return (
    <>
      <button
        className={`flex justify-center items-center gap-2 mt-2 ${color} p-2 rounded-lg font-medium cursor-pointer`}
        type={type}
      >
        {label}
      </button>
    </>
  );
}

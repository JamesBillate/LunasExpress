export default function EntryField({
  type,
  label,
  placeholder,
  onChange,
  value,
  icon,
}) {
  return (
    <>
      <label className="mt-3">{label}</label>
      <div className="relative w-full border-1 pl-4 py-2 pr-5 rounded-lg text-md focus:ring-2 focus:ring-blue-500">
        <input
          className={`${icon && "pl-8 "} rounded-lg text-md w-full`}
          placeholder={placeholder}
          type={type}
          onChange={onChange}
          value={value}
        />
        {icon ? (
          <div className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            {icon}
          </div>
        ) : (
          ""
        )}
      </div>
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

export function Main({ type, label, color }) {
  return (
    <>
      <button
        className={`flex justify-center items-center gap-2 mt-2 ${color} px-5 py-4 rounded-4xl font-medium cursor-pointer w-1/6 inset-shadow-md`}
        type={type}
      >
        {label}
      </button>
    </>
  );
}
